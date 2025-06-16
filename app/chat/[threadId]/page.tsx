"use client";

import { useChat } from "@ai-sdk/react";
import { UploadPDF } from "@/components/ui/UploadPdf";
import { useParams } from "next/navigation";
import { useInteractions } from "@/hooks/useInteractions";

export default function ChatPage() {
  const { threadId } = useParams<{ threadId: string }>();
  const { interactions, loading } = useInteractions(threadId);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    body: { threadId },
    maxSteps: 3,
  });

  return (
    <div className="flex flex-col w-full max-w-2xl px-4 py-10 mx-auto">
      <div className="space-y-4 mb-20">
        {/* Loaded past messages from the backend */}
        {!loading &&
          interactions.map((m) => (
            <div key={m.id}>
              <div className="font-bold text-gray-500">{m.role}</div>
              <p>{m.content}</p>
            </div>
          ))}

        {/* Live streamed messages using useChat */}
        {messages.map((m) => (
          <div key={m.id}>
            <div className="font-bold">{m.role}</div>
            <p>
              {m.content.length > 0 ? (
                m.content
              ) : (
                <span className="italic font-light">
                  {"calling tool: " + m?.toolInvocations?.[0]?.toolName}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Fixed input bar at the bottom with PDF upload */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-6 left-64 right-6 flex items-center bg-white border border-gray-300 rounded shadow-xl px-0"
      >
        <UploadPDF threadId={threadId} />
        <input
          className="flex-1 px-3 py-2 text-sm focus:outline-none"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
