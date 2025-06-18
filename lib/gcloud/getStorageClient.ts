import { Storage } from "@google-cloud/storage";
import fs from "fs/promises";

export async function getStorageClient() {
  let credentials: Record<string, any>;

  // Vercel uses GOOGLE_CREDENTIALS_BASE64, local dev uses a file
  // This allows us to use the same code in both environments
  if (process.env.GOOGLE_CREDENTIALS_BASE64) {
    const decoded = Buffer.from(
      process.env.GOOGLE_CREDENTIALS_BASE64,
      "base64"
    ).toString("utf-8");
    credentials = JSON.parse(decoded);
  } else {
    const credentialsPath = "./gcloud/seismic-bucksaw-354719-f958a6f131cb.json";
    const raw = await fs.readFile(credentialsPath, "utf-8");
    credentials = JSON.parse(raw);
  }

  return new Storage({ credentials });
}
