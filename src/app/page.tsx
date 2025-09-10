"use client";

import { useState } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { ChatSidebar } from "@/components/chat/ChatSidebar";

export default function Home() {
  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>();

  const handleNewChat = () => {
    setSelectedSessionId(undefined);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Career Counselor AI</h1>
          <p className="text-gray-600 mt-2">
            Get personalized career guidance and professional development advice
          </p>
        </header>
        
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
              <div className="bg-white rounded-lg border-2 border-dashed border-gray-200 h-[600px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <h3 className="text-lg font-medium mb-2">Welcome to Career Counselor AI</h3>
                  <p className="text-sm mb-4">
                    Select an existing chat from the sidebar or create a new one to get started.
                  </p>
                  <p className="text-xs text-gray-400">
                    I can help you with career planning, job search strategies, skill development, and more!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
