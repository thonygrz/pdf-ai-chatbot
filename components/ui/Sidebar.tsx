"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Sidebar component displaying a list of chat threads and a button to create new ones
export default function Sidebar() {
  const [threads, setThreads] = useState<
    Array<{ id: string; title: string | null }>
  >([]);
  const router = useRouter();

  // Fetch all threads when the component mounts
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await fetch("/api/threads");
        const data = await res.json();
        setThreads(data);
      } catch (error) {
        console.error("Failed to fetch threads:", error);
      }
    };

    fetchThreads();
  }, []);

  // Create a new thread and navigate to its page
  const createThread = async () => {
    try {
      const res = await fetch("/api/threads", { method: "POST" });
      const data = await res.json();
      router.push(`/chat/${data.id}`);
    } catch (error) {
      console.error("Failed to create thread:", error);
    }
  };

  return (
    <div className="w-64 h-full border-r bg-gray-50 p-4 space-y-4">
      <button
        onClick={createThread}
        className="w-full py-2 px-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + New Chat
      </button>

      <div className="space-y-2">
        {threads.map((thread) => (
          <Link
            key={thread.id}
            href={`/chat/${thread.id}`}
            className="block px-2 py-1 rounded hover:bg-gray-200 truncate"
          >
            {thread.title || thread.id}
          </Link>
        ))}
      </div>
    </div>
  );
}
