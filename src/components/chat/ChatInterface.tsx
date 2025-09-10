"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { trpc } from "@/lib/trpc/client";
import { Message } from "@/lib/db/schema";

interface ChatInterfaceProps {
  sessionId: string;
}

export function ChatInterface({ sessionId }: ChatInterfaceProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: messages = [], refetch } = trpc.chat.getMessages.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );
  
  const addMessage = trpc.chat.addMessage.useMutation();
  const aiChat = trpc.ai.chat.useMutation();

  const handleSendMessage = async (content: string) => {
    if (!sessionId) return;
    
    setIsLoading(true);
    
    try {
      // Add user message
      await addMessage.mutateAsync({
        sessionId,
        role: "user",
        content,
      });
      
      // Refresh messages to get the user message
      await refetch();
      
      // Get AI response
      const aiResponse = await aiChat.mutateAsync({
        messages: [
          ...messages.map(msg => ({ 
            role: msg.role as "user" | "assistant", 
            content: msg.content 
          })),
          { role: "user", content }
        ],
      });
      
      // Add AI response
      await addMessage.mutateAsync({
        sessionId,
        role: "assistant",
        content: aiResponse.content,
      });
      
      // Refresh messages again
      await refetch();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput 
        onSendMessage={handleSendMessage} 
        disabled={isLoading}
      />
    </Card>
  );
}
