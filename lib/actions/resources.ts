"use server";

import {
  NewResourceParams,
  insertResourceSchema,
  resources,
} from "@/lib/db/schema/resources";
import { db } from "../db";
import { generateEmbeddings } from "../ai/embedding";
import { embeddings as embeddingsTable } from "../db/schema/embeddings";

/**
 * Creates a resource entry in the database and generates embeddings for it.
 * @param input The input parameters for creating a new resource, including content and an optional PDF ID.
 * @returns A success message or an error message.
 */
export const createResource = async (input: NewResourceParams) => {
  try {
    const { content, pdfId } = insertResourceSchema.parse(input);

    // Insert the resource into the database
    const [resource] = await db
      .insert(resources)
      .values({ content, pdfId: pdfId ?? null }) // Fallback to null if no PDF ID provided
      .returning();

    // Generate and store embeddings for the inserted resource
    const embeddings = await generateEmbeddings(content);
    await db.insert(embeddingsTable).values(
      embeddings.map((embedding) => ({
        resourceId: resource.id,
        ...embedding,
      }))
    );

    return "Resource successfully created and embedded.";
  } catch (error) {
    // Return detailed error message if available
    return error instanceof Error && error.message.length > 0
      ? error.message
      : "An unexpected error occurred while creating the resource.";
  }
};
