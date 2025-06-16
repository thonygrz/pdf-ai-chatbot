"use server";

import { db } from "@/lib/db";
import { threads as threadsTable } from "../db/schema/threads";
import { eq } from "drizzle-orm";

/**
 * 
 * Creates a new thread with the specified title and returns its ID.
 * @param title The title of the thread to create.
 * @returns The ID of the newly created thread.
 */
export async function createThread(title: string) {
  const [t] = await db.insert(threadsTable).values({ title }).returning();
  return { id: t.id };
}

/**
 * Retrieves a list of all threads, ordered by creation time.
 * @returns A list of all threads.
 */
export async function listThreads() {
  return db
    .select()
    .from(threadsTable)
    .orderBy((thread) => thread.createdAt);
}

/**
 * Deletes a thread by its ID.
 * @param id The ID of the thread to delete.
 * @returns A promise that resolves when the thread is deleted.
 */
export async function deleteThread(id: string) {
  await db.delete(threadsTable).where(eq(threadsTable.id, id));
}

/**
 * Renames a thread with the specified ID to a new title.
 * @param threadId The ID of the thread to rename.
 * @param title The new title for the thread.
 * @returns A promise that resolves when the thread is renamed.
 */
export async function renameThread(threadId: string, title: string) {
  await db
    .update(threadsTable)
    .set({ title })
    .where(eq(threadsTable.id, threadId));
}
