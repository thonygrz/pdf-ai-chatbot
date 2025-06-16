import { createResource } from "@/lib/actions/resources";
import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";
import { findRelevantContent } from "@/lib/ai/embedding";
import { addInteraction } from "@/lib/actions/interactions";
import { renameThread } from "@/lib/actions/threads";
import { db } from "@/lib/db";
import { threads } from "@/lib/db/schema/threads";
import { eq } from "drizzle-orm";

// Set maximum request duration
export const maxDuration = 30;

export async function POST(req: Request) {
  const { threadId, messages, messages: uiMessages } = await req.json();
  if (!threadId) return new Response("Missing threadId", { status: 400 });

  // Save the latest user message
  const lastUserMsg = uiMessages.slice(-1)[0];
  await addInteraction(threadId, "user", lastUserMsg.content);

  // Rename thread if still untitled
  const thread = await db
    .select({ title: threads.title })
    .from(threads)
    .where(eq(threads.id, threadId))
    .then((res) => res[0]);

  if (thread?.title === "New Chat") {
    const firstLine = lastUserMsg.content.split("\n")[0].slice(0, 50);
    const cleanedTitle = firstLine.replace(/[^a-zA-Z0-9\s¿?¡!.,]/g, "").trim();
    await renameThread(threadId, cleanedTitle || "Untitled Chat");
  }

  // Generate assistant response with streaming
  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: `
      You are a helpful assistant.
      You must always use the "getInformation" tool before responding to any question from the user.
      If no relevant information is found, respond with "Sorry, I don't know."
      Never try to answer without checking the tool first.
    `,
    tools: {
      addResource: tool({
        description: `Add a resource to your knowledge base. If the user provides unprompted knowledge, use this tool without asking.`,
        parameters: z.object({
          content: z.string().describe("The resource content to save"),
        }),
        execute: async ({ content }) =>
          createResource({ content, pdfId: null }),
      }),
      getInformation: tool({
        description: `Retrieve relevant information from your knowledge base and past conversation.`,
        parameters: z.object({
          question: z.string().describe("User question"),
        }),
        execute: async ({ question }) => {
          const results = await findRelevantContent(question, threadId);
          return results.map((r) => `• ${r.name}`).join("\n\n");
        },
      }),
    },
  });

  // Add the assistant's response to the thread
  result.text.then((fullText) => {
    addInteraction(threadId, "assistant", fullText);
  });

  // Return the streaming response immediately
  return result.toDataStreamResponse();
}
