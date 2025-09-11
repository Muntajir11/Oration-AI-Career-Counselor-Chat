/**
 * Home Page Component
 * 
 * This is the main landing page for the Career Counselor application.
 * It provides a comprehensive chat interface with session management capabilities.
 * 
 * Features:
 * - Session-based chat management with sidebar navigation
 * - Welcome screen with application overview
 * - Responsive layout with sidebar and main chat area
 * - Feature highlights for career planning and job search
 * - Dynamic session selection and creation
 */

"use client";

import { useState } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { AuthHeader } from "@/components/auth/AuthHeader";

/**
 * Home Component
 * 
 * Main page component that manages the overall chat application layout.
 * Handles session state management and provides navigation between different chat sessions.
 * 
 * @returns The complete home page layout with chat functionality
 */
export default function Home() {
  // State to track the currently selected chat session
  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>();

  /**
   * Handler for creating a new chat session
   * Resets the selected session to show the welcome screen
   */
  const handleNewChat = () => {
    setSelectedSessionId(undefined);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Authentication header with user controls */}
      <AuthHeader />
      
      <main className="h-screen pt-16">
        <div className="h-full max-w-full">
          <div className="flex h-full">
            {/* Left sidebar for chat session management */}
            <div className="w-80 bg-card border-r border-border">
              <ChatSidebar
                selectedSessionId={selectedSessionId}
                onSessionSelect={setSelectedSessionId}
                onNewChat={handleNewChat}
              />
            </div>
          
            {/* Main content area - shows either chat interface or welcome screen */}
            <div className="flex-1 bg-background">
              {selectedSessionId ? (
                // Active chat session interface
                <ChatInterface sessionId={selectedSessionId} />
              ) : (
                // Welcome screen displayed when no session is selected
                <div className="h-full flex items-center justify-center p-8">
                  <div className="text-center max-w-2xl">
                    <div className="mb-8">
                      {/* Application icon and branding */}
                      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary flex items-center justify-center">
                        <svg className="w-12 h-12 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      
                      {/* Welcome message and application description */}
                      <h3 className="text-3xl font-bold mb-3 text-foreground">Welcome to Career Counselor AI</h3>
                      <p className="text-lg mb-6 text-muted-foreground leading-relaxed">
                        Select an existing chat from the sidebar or create a new one to get started.
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        I can help you with career planning, job search strategies, skill development, interview preparation, 
                        resume optimization, and much more! Let's build your professional future together.
                      </p>
                    </div>
                    
                    {/* Feature highlight cards */}
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      {/* Career Planning feature card */}
                      <div className="p-4 rounded-lg bg-card/60 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-200">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">Career Planning</h4>
                        <p className="text-xs text-muted-foreground">Strategic guidance for your career path</p>
                      </div>
                      
                      {/* Job Search feature card */}
                      <div className="p-4 rounded-lg bg-card/60 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-200">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mb-3">
                          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                          </svg>
                        </div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">Job Search</h4>
                        <p className="text-xs text-muted-foreground">Find the perfect opportunities</p>
                      </div>
                    </div>
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
