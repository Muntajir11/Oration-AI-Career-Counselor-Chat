"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { trpc } from "@/lib/trpc/client";
import { Message } from "@/lib/db/schema";
import { localMessageStorage } from "@/lib/storage/localStorage";
import { useAuth } from "@/lib/auth/AuthContext";

interface ChatInterfaceProps {
  sessionId: string;
}

export function ChatInterface({ sessionId }: ChatInterfaceProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { isAuthenticated } = useAuth();
  const previousSessionId = useRef(sessionId);
  const previousIsAuthenticated = useRef(isAuthenticated);
  
  const aiChat = trpc.ai.chat.useMutation();
  const addMessageMutation = trpc.chat.addMessage.useMutation();
  
  // Database query for messages (only when authenticated)
  const { data: dbMessages = [], refetch: refetchMessages } = trpc.chat.getMessages.useQuery(
    { sessionId },
    { enabled: !!sessionId && isAuthenticated }
  );

  // Load messages when sessionId changes
  useEffect(() => {
    if (sessionId && sessionId !== previousSessionId.current) {
      previousSessionId.current = sessionId;
      if (isAuthenticated) {
        // Use database messages when authenticated
        setMessages(dbMessages);
      } else {
        // Load from localStorage for non-authenticated users
        const localMessages = localMessageStorage.getMessages(sessionId);
        setMessages(localMessages);
      }
    }
  }, [sessionId, isAuthenticated]);

  // Update messages when dbMessages changes (only for authenticated users)
  useEffect(() => {
    if (isAuthenticated && sessionId) {
      setMessages(dbMessages);
    }
  }, [dbMessages.length, isAuthenticated, sessionId]); // Use length instead of full array

  // Handle auth state changes
  useEffect(() => {
    if (previousIsAuthenticated.current !== isAuthenticated) {
      previousIsAuthenticated.current = isAuthenticated;
      if (sessionId) {
        if (isAuthenticated) {
          setMessages(dbMessages);
        } else {
          const localMessages = localMessageStorage.getMessages(sessionId);
          setMessages(localMessages);
        }
      }
    }
  }, [isAuthenticated, sessionId, dbMessages.length]);

  const handleSendMessage = async (content: string) => {
    if (!sessionId) return;
    
    // Immediately add user message to UI
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      chatSessionId: sessionId,
      role: "user",
      content,
      createdAt: new Date(),
    };
    
    // Update UI immediately with user message
    setMessages(prevMessages => [...prevMessages, tempUserMessage]);
    setIsLoading(true);
    
    try {
      // Add user message to storage/database
      let userMessage: Message;
      if (isAuthenticated) {
        // Add to database when authenticated
        userMessage = await addMessageMutation.mutateAsync({
          sessionId,
          role: "user",
          content,
        });
      } else {
        // Add to localStorage for non-authenticated users
        userMessage = localMessageStorage.addMessage({
          sessionId,
          role: "user",
          content,
        });
      }
      
      // Update the temporary message with the real one
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === tempUserMessage.id ? userMessage : msg
        )
      );
      
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
      let assistantMessage: Message;
      if (isAuthenticated) {
        // Add to database when authenticated
        assistantMessage = await addMessageMutation.mutateAsync({
          sessionId,
          role: "assistant",
          content: aiResponse.content,
        });
      } else {
        // Add to localStorage for non-authenticated users
        assistantMessage = localMessageStorage.addMessage({
          sessionId,
          role: "assistant",
          content: aiResponse.content,
        });
      }
      
      // Update UI with AI response
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove the temporary user message on error
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== tempUserMessage.id)
      );
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
