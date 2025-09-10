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
      <div className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Career Counselor AI</h1>
          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            <Save className="h-3 w-3 mr-1" />
            Chats Saved
          </Badge>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600 dark:text-gray-300">Welcome, {user.name || user.email}</span>
          <ThemeToggle />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="flex items-center space-x-1"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Career Counselor AI</h1>
        <Card className="px-3 py-1 bg-amber-50 border-amber-200 dark:bg-amber-900 dark:border-amber-700">
          <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center">
            <Save className="h-3 w-3 mr-1" />
            Sign up to save your chats permanently
          </p>
        </Card>
      </div>
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <Link href="/auth/login">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center space-x-1"
          >
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </Button>
        </Link>
        <Link href="/auth/signup">
          <Button 
            size="sm"
            className="flex items-center space-x-1"
          >
            <UserPlus className="h-4 w-4" />
            <span>Sign Up</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
