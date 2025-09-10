"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatSession } from "@/lib/db/schema";
import { localChatStorage } from "@/lib/storage/localStorage";
import { useAuth } from "@/lib/auth/AuthContext";
import { trpc } from "@/lib/trpc/client";

interface ChatSidebarProps {
  selectedSessionId?: string;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
}

export function ChatSidebar({ selectedSessionId, onSessionSelect, onNewChat }: ChatSidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const previousIsAuthenticated = useRef(isAuthenticated);

  // tRPC hooks for database operations
  const { data: dbSessions = [], refetch: refetchSessions } = trpc.chat.getSessions.useQuery(
    { userId: user?.id },
    { enabled: isAuthenticated && !!user?.id }
  );
  const createSessionMutation = trpc.chat.createSession.useMutation();
  const deleteSessionMutation = trpc.chat.deleteSession.useMutation();

  // Load sessions when authentication state changes or dbSessions changes
  useEffect(() => {
    if (isAuthenticated) {
      // Use database sessions when authenticated
      setSessions(dbSessions);
    } else {
      // Load from localStorage for non-authenticated users
      const localSessions = localChatStorage.getSessions();
      setSessions(localSessions);
    }
  }, [isAuthenticated, dbSessions.length]); // Use length instead of the full array

  // Handle auth state changes
  useEffect(() => {
    if (previousIsAuthenticated.current !== isAuthenticated) {
      previousIsAuthenticated.current = isAuthenticated;
      if (!isAuthenticated) {
        // Load localStorage when switching to non-authenticated
        const localSessions = localChatStorage.getSessions();
        setSessions(localSessions);
      }
    }
  }, [isAuthenticated]);

  const handleCreateSession = async () => {
    if (!newChatTitle.trim()) return;
    
    setIsLoading(true);
    try {
      let newSession: ChatSession;
      
      if (isAuthenticated && user?.id) {
        // Create in database when authenticated
        newSession = await createSessionMutation.mutateAsync({
          title: newChatTitle.trim(),
          userId: user.id, // Ensure user.id is not undefined
        });
        await refetchSessions(); // Refresh database sessions
      } else {
        // Create in localStorage for non-authenticated users
        newSession = localChatStorage.createSession({
          title: newChatTitle.trim(),
        });
        // Refresh local sessions
        const localSessions = localChatStorage.getSessions();
        setSessions(localSessions);
      }
      
      setNewChatTitle("");
      setIsCreating(false);
      onSessionSelect(newSession.id);
    } catch (error) {
      console.error("Error creating session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (confirm("Are you sure you want to delete this chat?")) {
      setIsLoading(true);
      try {
        if (isAuthenticated) {
          // Delete from database when authenticated
          await deleteSessionMutation.mutateAsync({ sessionId });
          await refetchSessions(); // Refresh database sessions
        } else {
          // Delete from localStorage for non-authenticated users
          localChatStorage.deleteSession(sessionId);
          // Refresh local sessions
          const localSessions = localChatStorage.getSessions();
          setSessions(localSessions);
        }
        
        if (selectedSessionId === sessionId) {
          onNewChat();
        }
      } catch (error) {
        console.error("Error deleting session:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const startNewChat = () => {
    // Only allow creating chats if user is authenticated with valid ID, or not authenticated (localStorage)
    if (isAuthenticated && !user?.id) {
      console.error("Cannot create chat: User ID is missing");
      return;
    }
    setIsCreating(true);
    setNewChatTitle("New Career Chat");
  };

  return (
    <Card className="w-80 h-[600px] flex flex-col">
      <div className="p-4 border-b">
        <Button 
          onClick={startNewChat} 
          className="w-full" 
          variant="default"
          disabled={isAuthenticated && !user?.id}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
        {isAuthenticated && !user?.id && (
          <p className="text-xs text-red-500 mt-1">Please log in again to create chats</p>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {isCreating && (
          <div className="mb-4 space-y-2">
            <Input
              value={newChatTitle}
              onChange={(e) => setNewChatTitle(e.target.value)}
              placeholder="Enter chat title..."
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateSession();
                if (e.key === "Escape") {
                  setIsCreating(false);
                  setNewChatTitle("");
                }
              }}
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreateSession}>
                Create
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setIsCreating(false);
                  setNewChatTitle("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => onSessionSelect(session.id)}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                selectedSessionId === session.id && "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
              )}
            >
              <div className="flex items-center flex-1 min-w-0">
                <MessageSquare className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate dark:text-gray-200">{session.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {session.createdAt ? new Date(session.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => handleDeleteSession(session.id, e)}
                className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        
        {sessions.length === 0 && !isCreating && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-sm">No chat sessions yet.</p>
            <p className="text-xs">Click "New Chat" to get started!</p>
          </div>
        )}
      </div>
    </Card>
  );
}
