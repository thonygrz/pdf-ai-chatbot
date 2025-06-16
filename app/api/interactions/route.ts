import { getInteractions } from "@/lib/actions/interactions";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // Extract threadId from query params
  const { searchParams } = new URL(req.url);
  const threadId = searchParams.get("threadId");

  if (!threadId) {
    return NextResponse.json({ error: "Missing threadId" }, { status: 400 });
  }

  // Fetch all interactions for the given thread
  const messages = await getInteractions(threadId);

  return NextResponse.json(messages);
}
