/**
 * Message Bubble Component
 * 
 * This component renders individual chat messages with proper formatting and styling.
 * It supports markdown rendering for rich text content and adapts its appearance
 * based on whether the message is from a user or the assistant.
 * 
 * Features:
 * - Markdown content rendering with GitHub Flavored Markdown support
 * - Dynamic styling based on message sender (user vs assistant)
 * - Responsive design with proper spacing and alignment
 * - Timestamp display for message tracking
 * - Custom component styling for various markdown elements
 */

"use client";

import { cn } from "@/lib/utils";
import { Message } from "@/lib/db/schema";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
  message: Message;
}

/**
 * MessageBubble Component
 * 
 * Renders a styled message bubble with markdown support and appropriate
 * positioning based on the message sender (user or assistant).
 * 
 * @param message - The message object containing content, role, and metadata
 * @returns Formatted message bubble with content and timestamp
 */
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
          "max-w-[75%] rounded-2xl px-5 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card text-card-foreground border border-border"
        )}
      >
        {/* Markdown content container with custom component styling */}
        <div className="markdown-content">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} // GitHub Flavored Markdown support
            components={{
              // Custom paragraph styling with proper spacing
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              // Bold text styling
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              // Italic text styling
              em: ({ children }) => <em className="italic">{children}</em>,
              // Inline code styling with background
              code: ({ children }) => (
                <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
                  {children}
                </code>
              ),
              // Code block styling with proper formatting
              pre: ({ children }) => (
                <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-xs">
                  {children}
                </pre>
              ),
              // Unordered list styling
              ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
              // Ordered list styling
              ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
              // List item styling
              li: ({ children }) => <li className="mb-1">{children}</li>,
              // Heading styles with appropriate hierarchy
              h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        
        {/* Message timestamp */}
        <div
          className={cn(
            "text-xs mt-2 opacity-70",
            isUser ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : ""}
        </div>
      </div>
    </div>
  );
}
