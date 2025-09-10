"use client";

import { cn } from "@/lib/utils";
import { Message } from "@/lib/db/schema";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  
  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2 text-sm",
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-900 border"
        )}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div
          className={cn(
            "text-xs mt-1 opacity-70",
            isUser ? "text-blue-100" : "text-gray-500"
          )}
        >
          {message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : ""}
        </div>
      </div>
    </div>
  );
}
