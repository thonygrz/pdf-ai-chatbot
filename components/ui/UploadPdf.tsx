"use client";

import { useState, useRef } from "react";
import { Paperclip, Loader2 } from "lucide-react";

interface UploadPDFProps {
  threadId: string;
}

// Component to upload a PDF and associate it with a given thread
export function UploadPDF({ threadId }: UploadPDFProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !threadId) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("threadId", threadId);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      alert(data.message || "Upload successful");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center pl-2">
      <button
        onClick={handleClick}
        type="button"
        className="p-2 rounded-md hover:bg-gray-200 transition"
        title="Upload PDF"
      >
        {uploading ? (
          <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
        ) : (
          <Paperclip className="w-5 h-5 text-gray-600" />
        )}
      </button>
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
