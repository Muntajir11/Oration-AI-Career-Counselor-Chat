"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc/client";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  selectedSessionId?: string;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
}

export function ChatSidebar({ selectedSessionId, onSessionSelect, onNewChat }: ChatSidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  
  const { data: sessions = [], refetch } = trpc.chat.getSessions.useQuery();
  const createSession = trpc.chat.createSession.useMutation();
  const deleteSession = trpc.chat.deleteSession.useMutation();

  const handleCreateSession = async () => {
    if (!newChatTitle.trim()) return;
    
    try {
      const newSession = await createSession.mutateAsync({
        title: newChatTitle.trim(),
      });
      
      setNewChatTitle("");
      setIsCreating(false);
      await refetch();
      onSessionSelect(newSession.id);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (confirm("Are you sure you want to delete this chat?")) {
      try {
        await deleteSession.mutateAsync({ sessionId });
        await refetch();
        
        if (selectedSessionId === sessionId) {
          onNewChat();
        }
      } catch (error) {
        console.error("Error deleting session:", error);
      }
    }
  };

  const startNewChat = () => {
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
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
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
                "flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors",
                selectedSessionId === session.id && "bg-blue-50 border border-blue-200"
              )}
            >
              <div className="flex items-center flex-1 min-w-0">
                <MessageSquare className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{session.title}</p>
                  <p className="text-xs text-gray-500">
                    {session.createdAt ? new Date(session.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => handleDeleteSession(session.id, e)}
                className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        
        {sessions.length === 0 && !isCreating && (
          <div className="text-center text-gray-500 mt-8">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">No chat sessions yet.</p>
            <p className="text-xs">Click "New Chat" to get started!</p>
          </div>
        )}
      </div>
    </Card>
  );
}
