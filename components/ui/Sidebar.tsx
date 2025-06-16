"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Type for thread entries
type Thread = {
  id: string;
  title: string | null;
};

export default function Sidebar() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const router = useRouter();

  // Fetch all threads from the backend
  const fetchThreads = async () => {
    try {
      const response = await fetch("/api/threads");
      if (!response.ok) throw new Error("Failed to fetch threads");
      const data = await response.json();
      setThreads(data);
    } catch (error) {
      console.error("Error loading threads:", error);
    }
  };

  // Initial load of threads
  useEffect(() => {
    fetchThreads();
  }, []);

  // Create a new thread and refresh the thread list
  const createThread = async () => {
    try {
      const response = await fetch("/api/threads", { method: "POST" });
      if (!response.ok) throw new Error("Failed to create thread");
      const data = await response.json();

      await fetchThreads(); // Refresh the sidebar list
      router.push(`/chat/${data.id}`); // Navigate to the new thread
    } catch (error) {
      console.error("Error creating thread:", error);
    }
  };

  return (
    <aside className="w-64 border-r h-full p-4 space-y-4 bg-gray-50">
      {/* Button to create a new thread */}
      <button
        onClick={createThread}
        className="w-full py-2 px-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        + New Chat
      </button>

      {/* List of existing threads */}
      <nav className="space-y-2">
        {threads.map((thread) => (
          <Link
            key={thread.id}
            href={`/chat/${thread.id}`}
            className="block px-2 py-1 rounded hover:bg-gray-200 truncate"
          >
            {thread.title || thread.id}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
