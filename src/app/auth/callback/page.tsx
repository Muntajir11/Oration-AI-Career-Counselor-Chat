/**
 * Authentication Callback Page
 * 
 * This page handles the authentication callback from Supabase after a user
 * completes the sign-in process. It processes the authentication result and
 * redirects the user to the appropriate page based on the outcome.
 * 
 * @route /auth/callback
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

/**
 * AuthCallback Component
 * 
 * Processes authentication callbacks from Supabase and handles user redirection.
 * Shows a loading state while processing the authentication result.
 * 
 * @returns Loading spinner with authentication processing message
 */
export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    /**
     * Handle Authentication Callback
     * 
     * Retrieves the current session from Supabase and redirects the user
     * based on whether authentication was successful or not.
     */
    const handleAuthCallback = async () => {
      try {
        // Retrieve the current authentication session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth callback error:", error);
          router.push("/auth/login?error=callback_error");
          return;
        }

        if (data.session) {
          // Successful authentication - redirect to home page
          router.push("/");
        } else {
          // No session found - redirect back to login
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        router.push("/auth/login?error=callback_error");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Loading spinner to indicate processing */}
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}
