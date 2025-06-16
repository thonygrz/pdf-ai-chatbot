import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { Storage } from "@google-cloud/storage";
import { v4 as uuid } from "uuid";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { createResource } from "@/lib/actions/resources";
import { createThread } from "@/lib/actions/threads";
import { createPdf } from "@/lib/actions/pdfs";

export const runtime = "nodejs";

const bucketName = process.env.TEXT_BUCKET!;
const storage = new Storage();
const vision = new ImageAnnotatorClient();

// Uploads the PDF to Google Cloud Storage
async function uploadToGCS(localPath: string, destName: string) {
  await storage.bucket(bucketName).upload(localPath, { destination: destName });
  return `gs://${bucketName}/${destName}`;
}

// Starts asynchronous OCR operation using Google Vision
async function runOcr(gcsUri: string, outputPrefix: string) {
  const [op] = await vision.asyncBatchAnnotateFiles({
    requests: [
      {
        inputConfig: {
          gcsSource: { uri: gcsUri },
          mimeType: "application/pdf",
        },
        outputConfig: {
          gcsDestination: { uri: `gs://${bucketName}/${outputPrefix}` },
        },
        features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
      },
    ],
  });
  await op.promise(); // Waits for the operation to finish
}

// Downloads the OCR result JSON and extracts full text
async function downloadOcrText(outputPrefix: string): Promise<string> {
  const [files] = await storage
    .bucket(bucketName)
    .getFiles({ prefix: outputPrefix });
  let full = "";

  for (const file of files) {
    const [content] = await file.download();
    const json = JSON.parse(content.toString()) as any;
    const pages = json.responses.flatMap(
      (r: any) => r.fullTextAnnotation?.text || ""
    );
    full += pages.join("\n");
  }

  return full;
}

// Handles PDF upload, OCR processing and chunk storage
export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file = data.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const tmpDir = path.join(process.cwd(), "tmp");
  await fs.mkdir(tmpDir, { recursive: true });

  const tmpPath = path.join(tmpDir, `${uuid()}.pdf`);
  await fs.writeFile(tmpPath, new Uint8Array(await file.arrayBuffer()));

  const threadIdFromForm = data.get("threadId") as string | null;
  let threadId = threadIdFromForm;

  if (!threadId) {
    threadId = await createThread(`Thread ${new Date().toLocaleString()}`);
  }

  const pdfId = await createPdf(threadId, file.name);

  try {
    const pdfObjectName = `uploads/${uuid()}.pdf`;
    const gcsUri = await uploadToGCS(tmpPath, pdfObjectName);

    const outPrefix = `ocr-output/${uuid()}/`;
    await runOcr(gcsUri, outPrefix);
    const text = await downloadOcrText(outPrefix);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 100,
    });

    const docs = await splitter.createDocuments([text]);

    for (const d of docs) {
      await createResource({ content: d.pageContent, pdfId });
    }

    return NextResponse.json({
      message: `OCR OK – resources created: ${docs.length}`,
    });
  } catch (err) {
    console.error("OCR pipeline failed:", err);
    return NextResponse.json({ error: "OCR pipeline failed" }, { status: 500 });
  } finally {
    await fs.unlink(tmpPath).catch(() => {});
  }
}
