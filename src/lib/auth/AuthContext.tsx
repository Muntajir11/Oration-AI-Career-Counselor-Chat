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

  const mapSupabaseUser = (supabaseUser: SupabaseUser): User => ({
    id: supabaseUser.id,
    email: supabaseUser.email || "",
    name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email || "",
  });

  useEffect(() => {
    // Check if user is stored in localStorage first
    const checkStoredUser = async () => {
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

    checkStoredUser();

    // Listen for Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
  }, []);

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
      setUser(null);
      localStorage.removeItem("careercounselor_user");
      
      // Sign out from Supabase with global scope to clear all sessions
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error("Supabase logout error:", error);
      }
      
      // Additional cleanup: clear all auth-related cookies and storage
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
      
      // Clear sessionStorage as well
      sessionStorage.clear();
      
      // Force page reload to ensure clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, redirect to home
      window.location.href = '/';
    }
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
