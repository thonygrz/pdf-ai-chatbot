import { deleteThread } from "@/lib/actions/threads";
import { NextResponse } from "next/server";

// Deletes a thread by its ID
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Missing thread ID" }, { status: 400 });
  }

  try {
    await deleteThread(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete thread:", error);
    return NextResponse.json(
      { error: "Failed to delete thread" },
      { status: 500 }
    );
  }
}
