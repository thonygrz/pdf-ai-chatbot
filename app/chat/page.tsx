import { redirect } from "next/navigation";

// This page automatically creates a new thread and redirects to it
export default async function ChatRedirect() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/threads`, {
    method: "POST",
    cache: "no-store", // Prevent caching for dynamic thread creation
  });

  if (!res.ok) {
    throw new Error("Failed to create a new chat thread");
  }

  const data = await res.json();

  // Redirect the user to the newly created chat thread
  redirect(`/chat/${data.id}`);
}
