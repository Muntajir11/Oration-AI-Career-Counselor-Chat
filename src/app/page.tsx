"use client";

import { useState } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { AuthHeader } from "@/components/auth/AuthHeader";

export default function Home() {
  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>();

  const handleNewChat = () => {
    setSelectedSessionId(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AuthHeader />
      
      <main className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6">
            <ChatSidebar
              selectedSessionId={selectedSessionId}
              onSessionSelect={setSelectedSessionId}
              onNewChat={handleNewChat}
            />
          
            <div className="flex-1">
              {selectedSessionId ? (
                <ChatInterface sessionId={selectedSessionId} />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 h-[600px] flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Welcome to Career Counselor AI</h3>
                    <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">
                      Select an existing chat from the sidebar or create a new one to get started.
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      I can help you with career planning, job search strategies, skill development, and more!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
