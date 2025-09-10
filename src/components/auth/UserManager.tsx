"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { trpc } from "@/lib/trpc/client";

export function UserManager() {
  const { user, isAuthenticated, logout } = useAuth();
  const createUserMutation = trpc.user.createUser.useMutation();
  const checkUserQuery = trpc.user.checkUserExists.useQuery(
    { email: user?.email, supabaseId: user?.id },
    { enabled: !!user && isAuthenticated }
  );
  const hasCheckedUser = useRef(false);

  useEffect(() => {
    if (isAuthenticated && user && checkUserQuery.data && !hasCheckedUser.current) {
      hasCheckedUser.current = true;
      
      const { exists, isActive } = checkUserQuery.data;
      
      if (!exists) {
        // User doesn't exist in database, create them (for Google OAuth users)
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
  }, [isAuthenticated, user, checkUserQuery.data, createUserMutation, logout]);

  // Reset the check when user changes
  useEffect(() => {
    hasCheckedUser.current = false;
  }, [user?.id]);

  return null; // This component doesn't render anything
}
