"use client";

import { ChatSession, Message } from "@/lib/db/schema";
import { localChatStorage, localMessageStorage } from "@/lib/storage/localStorage";
import { trpc } from "@/lib/trpc/client";

// Define the interface for our chat service
export interface ChatService {
  // Sessions
  getSessions(): Promise<ChatSession[]>;
  createSession(input: { title: string; userId?: string }): Promise<ChatSession>;
  deleteSession(sessionId: string): Promise<boolean>;
  getSession(sessionId: string): Promise<ChatSession | null>;
  
  // Messages
  getMessages(sessionId: string): Promise<Message[]>;
  addMessage(input: { sessionId: string; role: "user" | "assistant"; content: string }): Promise<Message>;
}

// Service for localStorage (non-authenticated users)
export class LocalChatService implements ChatService {
  async getSessions(): Promise<ChatSession[]> {
    return localChatStorage.getSessions();
  }

  async createSession(input: { title: string; userId?: string }): Promise<ChatSession> {
    return localChatStorage.createSession(input);
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    return localChatStorage.deleteSession(sessionId);
  }

  async getSession(sessionId: string): Promise<ChatSession | null> {
    return localChatStorage.getSession(sessionId);
  }

  async getMessages(sessionId: string): Promise<Message[]> {
    return localMessageStorage.getMessages(sessionId);
  }

  async addMessage(input: { sessionId: string; role: "user" | "assistant"; content: string }): Promise<Message> {
    return localMessageStorage.addMessage(input);
  }
}

// Service for database (authenticated users)
export class DatabaseChatService implements ChatService {
  constructor(private trpcClient: any) {}

  async getSessions(): Promise<ChatSession[]> {
    return this.trpcClient.chat.getSessions.query();
  }

  async createSession(input: { title: string; userId?: string }): Promise<ChatSession> {
    return this.trpcClient.chat.createSession.mutate(input);
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    const result = await this.trpcClient.chat.deleteSession.mutate({ sessionId });
    return result.success;
  }

  async getSession(sessionId: string): Promise<ChatSession | null> {
    const sessions = await this.getSessions();
    return sessions.find(s => s.id === sessionId) || null;
  }

  async getMessages(sessionId: string): Promise<Message[]> {
    return this.trpcClient.chat.getMessages.query({ sessionId });
  }

  async addMessage(input: { sessionId: string; role: "user" | "assistant"; content: string }): Promise<Message> {
    return this.trpcClient.chat.addMessage.mutate(input);
  }
}

// Hook to get the appropriate chat service based on authentication status
export function useChatService(): ChatService {
  const trpcClient = trpc.useUtils();
  
  // For now, always use localStorage until we implement proper auth detection
  // In a real app, you'd check authentication status here
  return new LocalChatService();
}

// Migration utility (for when user logs in)
export async function migrateLocalChatsToDatabase(
  localService: LocalChatService,
  databaseService: DatabaseChatService,
  userId: string
): Promise<void> {
  try {
    const localSessions = await localService.getSessions();
    
    for (const session of localSessions) {
      // Create session in database
      const newSession = await databaseService.createSession({
        title: session.title,
        userId: userId,
      });

      // Get local messages for this session
      const localMessages = await localService.getMessages(session.id);
      
      // Add messages to database
      for (const message of localMessages) {
        await databaseService.addMessage({
          sessionId: newSession.id,
          role: message.role as "user" | "assistant",
          content: message.content,
        });
      }
    }

    // Clear local storage after successful migration
    localChatStorage.getSessions().forEach(session => {
      localChatStorage.deleteSession(session.id);
    });
    
    console.log("Successfully migrated local chats to database");
  } catch (error) {
    console.error("Error migrating local chats:", error);
    throw error;
  }
}
