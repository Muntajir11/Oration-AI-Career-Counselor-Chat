"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/lib/auth/AuthContext";
import { LogIn, UserPlus, LogOut, Save } from "lucide-react";
import Link from "next/link";

export function AuthHeader() {
  const { user, isAuthenticated, logout } = useAuth();

  if (isAuthenticated && user) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-foreground">Career Counselor AI</h1>
          </div>
          <Badge variant="secondary" className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30 backdrop-blur-sm">
            <Save className="h-3 w-3 mr-1" />
            Chats Saved
          </Badge>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">Welcome, {user.name || user.email}</span>
          <ThemeToggle />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="flex items-center space-x-1 transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-foreground">Career Counselor AI</h1>
        </div>
        <Card className="px-3 py-1 bg-amber-500/20 border-amber-500/30 backdrop-blur-sm">
          <p className="text-xs text-amber-600 dark:text-amber-300 flex items-center">
            <Save className="h-3 w-3 mr-1" />
            Sign up to save your chats permanently
          </p>
        </Card>
      </div>
      <div className="flex items-center space-x-3">
        <ThemeToggle />
        <Link href="/auth/login">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center space-x-1 transition-all duration-200"
          >
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </Button>
        </Link>
        <Link href="/auth/signup">
          <Button 
            size="sm"
            className="flex items-center space-x-1 professional-gradient text-white border-0 transition-all duration-200"
          >
            <UserPlus className="h-4 w-4" />
            <span>Sign Up</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
