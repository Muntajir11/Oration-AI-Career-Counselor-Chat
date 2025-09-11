/**
 * tRPC Client Configuration
 * 
 * This module sets up the tRPC client for type-safe API communication
 * between the frontend and backend. It provides React hooks for queries
 * and mutations with full TypeScript support.
 */

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/lib/trpc/root";

/**
 * tRPC React Client
 * 
 * Creates a typed tRPC client that provides React hooks for all
 * API procedures defined in the AppRouter.
 */
export const trpc = createTRPCReact<AppRouter>();
