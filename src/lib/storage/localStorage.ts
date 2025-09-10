import { ChatSession, Message, NewChatSession, NewMessage } from "@/lib/db/schema";

// Storage keys
const CHAT_SESSIONS_KEY = "careercounselor_chat_sessions";
const MESSAGES_KEY = "careercounselor_messages";

// Helper to generate UUID-like IDs for localStorage
function generateId(): string {
  return crypto.randomUUID();
}

// Chat Sessions Storage
export const localChatStorage = {
  // Get all chat sessions from localStorage
  getSessions(): ChatSession[] {
    try {
      const sessions = localStorage.getItem(CHAT_SESSIONS_KEY);
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error("Error loading sessions from localStorage:", error);
      return [];
    }
  },

  // Save all chat sessions to localStorage
  saveSessions(sessions: ChatSession[]): void {
    try {
      localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error("Error saving sessions to localStorage:", error);
    }
  },

  // Create a new chat session
  createSession(input: { title: string; userId?: string }): ChatSession {
    const newSession: ChatSession = {
      id: generateId(),
      title: input.title,
      userId: input.userId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const sessions = this.getSessions();
    sessions.unshift(newSession); // Add to beginning
    this.saveSessions(sessions);
    
    return newSession;
  },

  // Update a chat session
  updateSession(sessionId: string, updates: Partial<ChatSession>): ChatSession | null {
    const sessions = this.getSessions();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex === -1) return null;

    sessions[sessionIndex] = {
      ...sessions[sessionIndex],
      ...updates,
      updatedAt: new Date(),
    };
    
    this.saveSessions(sessions);
    return sessions[sessionIndex];
  },

  // Delete a chat session
  deleteSession(sessionId: string): boolean {
    const sessions = this.getSessions();
    const filteredSessions = sessions.filter(s => s.id !== sessionId);
    
    if (filteredSessions.length === sessions.length) return false;
    
    this.saveSessions(filteredSessions);
    
    // Also delete associated messages
    localMessageStorage.deleteAllMessagesForSession(sessionId);
    
    return true;
  },

  // Get session by ID
  getSession(sessionId: string): ChatSession | null {
    const sessions = this.getSessions();
    return sessions.find(s => s.id === sessionId) || null;
  },
};

// Messages Storage
export const localMessageStorage = {
  // Get all messages from localStorage
  getAllMessages(): Message[] {
    try {
      const messages = localStorage.getItem(MESSAGES_KEY);
      return messages ? JSON.parse(messages) : [];
    } catch (error) {
      console.error("Error loading messages from localStorage:", error);
      return [];
    }
  },

  // Save all messages to localStorage
  saveAllMessages(messages: Message[]): void {
    try {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving messages to localStorage:", error);
    }
  },

  // Get messages for a specific session
  getMessages(sessionId: string): Message[] {
    const allMessages = this.getAllMessages();
    return allMessages
      .filter(m => m.chatSessionId === sessionId)
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return aTime - bTime;
      });
  },

  // Add a new message
  addMessage(input: { sessionId: string; role: "user" | "assistant"; content: string }): Message {
    const newMessage: Message = {
      id: generateId(),
      chatSessionId: input.sessionId,
      role: input.role,
      content: input.content,
      createdAt: new Date(),
    };

    const allMessages = this.getAllMessages();
    allMessages.push(newMessage);
    this.saveAllMessages(allMessages);

    // Update session's updatedAt timestamp
    localChatStorage.updateSession(input.sessionId, { updatedAt: new Date() });

    return newMessage;
  },

  // Delete all messages for a session
  deleteAllMessagesForSession(sessionId: string): void {
    const allMessages = this.getAllMessages();
    const filteredMessages = allMessages.filter(m => m.chatSessionId !== sessionId);
    this.saveAllMessages(filteredMessages);
  },

  // Clear all messages
  clearAllMessages(): void {
    localStorage.removeItem(MESSAGES_KEY);
  },
};

// Utility to clear all local storage data
export const clearAllLocalChatData = (): void => {
  localStorage.removeItem(CHAT_SESSIONS_KEY);
  localStorage.removeItem(MESSAGES_KEY);
};

// Utility to check if localStorage is available
export const isLocalStorageAvailable = (): boolean => {
  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};
