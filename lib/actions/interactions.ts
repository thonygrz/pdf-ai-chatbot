"use server";

import { db } from "@/lib/db";
import { eq, asc } from "drizzle-orm";
import { interactions as interactionsTable } from "@/lib/db/schema/interactions";

/**
 * Adds a new interaction (user or assistant message) to a specific thread.
 * @param threadId The ID of the thread to which the interaction belongs.
 * @param role The role of the user (either "user" or "assistant").
 * @param content The content of the interaction.
 */
export async function addInteraction(
  threadId: string,
  role: "user" | "assistant",
  content: string
) {
  await db.insert(interactionsTable).values({ threadId, role, content });
}

/**
 * @param threadId The ID of the thread for which to retrieve interactions.
 * @returns A list of interactions for the specified thread.
 */
export async function getInteractions(threadId: string) {
  return db
    .select()
    .from(interactionsTable)
    .where(eq(interactionsTable.threadId, threadId))
    .orderBy(asc(interactionsTable.createdAt));
}
