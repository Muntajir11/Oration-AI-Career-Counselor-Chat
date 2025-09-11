"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  simulateLogin: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const mapSupabaseUser = (supabaseUser: SupabaseUser): User => ({
    id: supabaseUser.id,
    email: supabaseUser.email || "",
    name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email || "",
  });

  useEffect(() => {
    // Check if user is stored in localStorage first
    const checkStoredUser = async () => {
      // Don't auto-login during logout process
      if (isLoggingOut) return;
      
      // Check if we just logged out by looking for a logout flag
      const isLoggedOut = sessionStorage.getItem('just_logged_out');
      if (isLoggedOut) {
        sessionStorage.removeItem('just_logged_out');
        setIsLoading(false);
        return;
      }
      
      try {
        const storedUser = localStorage.getItem("careercounselor_user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsLoading(false);
          return;
        }

        // Check Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const mappedUser = mapSupabaseUser(session.user);
          setUser(mappedUser);
          localStorage.setItem("careercounselor_user", JSON.stringify(mappedUser));
        }
      } catch (error) {
        console.error("Error loading stored user:", error);
        localStorage.removeItem("careercounselor_user");
      }
      setIsLoading(false);
    };

    // Only check stored user on initial mount
    if (!isInitialized) {
      checkStoredUser();
      setIsInitialized(true);
    }

    // Listen for Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Don't process auth changes during logout
        if (isLoggingOut) return;
        
        if (session?.user) {
          const mappedUser = mapSupabaseUser(session.user);
          setUser(mappedUser);
          localStorage.setItem("careercounselor_user", JSON.stringify(mappedUser));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem("careercounselor_user");
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []); // Remove dependencies to prevent re-running

  // Separate effect to handle logout state changes
  useEffect(() => {
    if (isLoggingOut) {
      // Clear user state immediately when logout starts
      setUser(null);
      localStorage.removeItem("careercounselor_user");
    }
  }, [isLoggingOut]);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("careercounselor_user", JSON.stringify(userData));
  };

  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account'  // Force account selection
          }
        }
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Set logging out state to prevent re-authentication
      setIsLoggingOut(true);
      setIsLoading(true);
      
      // Set a flag to prevent auto-login on next page load
      sessionStorage.setItem('just_logged_out', 'true');
      
      // Immediately clear user state
      setUser(null);
      
      // Clear localStorage but preserve theme setting
      const themeData = localStorage.getItem('career-counselor-theme');
      localStorage.clear();
      if (themeData) {
        localStorage.setItem('career-counselor-theme', themeData);
      }
      
      // Clear sessionStorage except our logout flag
      const logoutFlag = sessionStorage.getItem('just_logged_out');
      sessionStorage.clear();
      if (logoutFlag) {
        sessionStorage.setItem('just_logged_out', logoutFlag);
      }
      
      // Clear all cookies
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
        if (name) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=localhost`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.localhost`;
        }
      });
      
      // Sign out from Supabase with global scope
      await supabase.auth.signOut({ scope: 'global' });
      
      // Wait to ensure cleanup is complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force redirect to home page and reload to clear all state
      window.location.href = '/';
      
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, clear everything and redirect
      setUser(null);
      
      // Clear localStorage but preserve theme setting
      const themeData = localStorage.getItem('career-counselor-theme');
      localStorage.clear();
      if (themeData) {
        localStorage.setItem('career-counselor-theme', themeData);
      }
      
      sessionStorage.clear();
      sessionStorage.setItem('just_logged_out', 'true');
      window.location.href = '/';
    }
    // Don't reset isLoggingOut here - let the page reload handle it
  };

  // Temporary method for testing (same as login)
  const simulateLogin = (userData: User) => {
    login(userData);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithGoogle,
    logout,
    simulateLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook to get current storage mode
export function useStorageMode() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? "database" : "localStorage";
}
