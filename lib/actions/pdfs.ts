"use server";

import { db } from "@/lib/db";
import { pdfs } from "@/lib/db/schema/pdfs";

/**
 * Creates a new PDF record associated with a thread and returns the generated ID.
 * @param threadId The ID of the thread to associate the PDF with.
 * @param title The title of the PDF.
 * @returns The ID of the newly created PDF.
 */
export async function createPdf(threadId: string, title: string) {
  const [row] = await db.insert(pdfs).values({ threadId, title }).returning();

  return row.id;
}
