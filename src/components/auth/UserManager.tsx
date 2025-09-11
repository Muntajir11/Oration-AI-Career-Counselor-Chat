/**
 * User Manager Component
 * 
 * This component handles user lifecycle management and database synchronization.
 * It automatically creates user records for OAuth users and manages user status
 * validation to ensure data consistency between authentication and database.
 * 
 * Features:
 * - Automatic user creation for OAuth sign-ins
 * - User existence validation
 * - Account status monitoring
 * - Automatic logout for inactive accounts
 * - Duplicate check prevention
 */

"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { trpc } from "@/lib/trpc/client";

/**
 * UserManager Component
 * 
 * Background component that manages user synchronization between authentication
 * providers and the application database. Runs automatically when user state changes.
 * 
 * @returns null - This is a utility component with no UI
 */
export function UserManager() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  
  // tRPC mutations and queries for user management
  const createUserMutation = trpc.user.createUser.useMutation();
  const checkUserQuery = trpc.user.checkUserExists.useQuery(
    { email: user?.email, supabaseId: user?.id },
    { enabled: !!user && isAuthenticated && !isLoading }
  );
  
  // Ref to prevent duplicate user creation attempts
  const hasCheckedUser = useRef(false);

  useEffect(() => {
    // Skip execution if still loading or user not authenticated
    if (isLoading || !isAuthenticated || !user) {
      hasCheckedUser.current = false;
      return;
    }

    // Process user status when data is available and not already processed
    if (checkUserQuery.data && !hasCheckedUser.current) {
      hasCheckedUser.current = true;
      
      const { exists, isActive } = checkUserQuery.data;
      
      if (!exists) {
        // Create new user record for OAuth users who don't exist in database
        createUserMutation.mutate({
          id: user.id,
          email: user.email,
          name: user.name,
          supabaseId: user.id,
        }, {
          onSuccess: () => {
            console.log('Google OAuth user created in database successfully');
          },
          onError: (error) => {
            console.error('Error creating Google OAuth user in database:', error);
            // If we can't create user, log them out
            logout();
          }
        });
      } else if (!isActive) {
        // User exists but is deactivated
        console.log('User account is deactivated');
        alert('Your account has been deactivated. Please contact support.');
        logout();
      } else {
        // User exists and is active
        console.log('User authenticated and verified in database');
      }
    }
  }, [isAuthenticated, user, checkUserQuery.data, createUserMutation, logout, isLoading]);

  // Reset the check when user changes
  useEffect(() => {
    hasCheckedUser.current = false;
  }, [user?.id]);

  return null; // This component doesn't render anything
}
