"use client";

import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 3,
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto">
      <div className="space-y-4 mb-20">
        {/* Render chat messages */}
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap">
            <div>
              <div className="font-bold text-gray-600">{m.role}</div>
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
          </div>
        ))}
      </div>

      {/* Message input form */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-6 w-full max-w-md flex items-center bg-white border border-gray-300 rounded shadow-xl"
      >
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
