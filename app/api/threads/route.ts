import { createThread, listThreads } from "@/lib/actions/threads";
import { NextResponse } from "next/server";

// Returns a list of all threads
export async function GET() {
  const threads = await listThreads();
  return NextResponse.json(threads);
}

// Creates a new thread, optionally with a custom title
export async function POST(req: Request) {
  let title = "New Chat";

  try {
    const body = await req.json();
    if (body?.title) title = body.title;
  } catch (err) {
    console.warn("Failed to parse request body. Using default title.", err);
  }

  const thread = await createThread(title);
  return NextResponse.json(thread);
}
