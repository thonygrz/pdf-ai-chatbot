import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { db } from "../db";
import { cosineDistance, desc, gt, sql, eq } from "drizzle-orm";
import { embeddings as embeddingsTable } from "../db/schema/embeddings";
import { interactions as interactionsTable } from "../db/schema/interactions";

const embeddingModel = openai.embedding("text-embedding-ada-002");

/**
 * Splits input text into chunks using periods as delimiters.
 * This basic chunking helps prepare data for embedding.
 */
const generateChunks = (input: string): string[] =>
  input
    .trim()
    .split(".")
    .filter((chunk) => chunk !== "");

/**
 * Generates multiple embeddings from a given string, chunked by sentence.
 * Each returned item includes the original content and its corresponding embedding.
 */
export const generateEmbeddings = async (
  value: string
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });

  return embeddings.map((embedding, index) => ({
    content: chunks[index],
    embedding,
  }));
};

/**
 * Generates a single embedding vector for a given string.
 */
export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });

  return embedding;
};

/**
 * Finds relevant content based on vector similarity.
 * Optionally merges content from a specific thread to give it priority.
 */
export const findRelevantContent = async (
  userQuery: string,
  threadId?: string
): Promise<Array<{ name: string; similarity: number }>> => {
  const userQueryVector = await generateEmbedding(userQuery);

  const similarity = sql<number>`1 - (${cosineDistance(
    embeddingsTable.embedding,
    userQueryVector
  )})`;

  const similarEmbeddings = await db
    .select({ name: embeddingsTable.content, similarity })
    .from(embeddingsTable)
    .where(gt(similarity, 0.5))
    .orderBy(desc(similarity))
    .limit(4);

  let threadMessages: Array<{ name: string; similarity: number }> = [];

  if (threadId) {
    const interactions = await db
      .select({ name: interactionsTable.content })
      .from(interactionsTable)
      .where(eq(interactionsTable.threadId, threadId))
      .limit(50);

    threadMessages = interactions.map((interaction) => ({
      name: interaction.name,
      similarity: 1, // maximum relevance for current thread messages
    }));
  }

  return [...threadMessages, ...similarEmbeddings];
};
