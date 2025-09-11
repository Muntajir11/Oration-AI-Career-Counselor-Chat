/**
 * tRPC API Route Handler
 * 
 * This file sets up the tRPC API endpoint for the application.
 * It handles all tRPC requests and provides type-safe API communication
 * between the frontend and backend.
 * 
 * @route /api/trpc/[...trpc]
 * @methods GET, POST
 */

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/lib/trpc/root";

/**
 * tRPC Request Handler
 * 
 * Configures the fetch request handler for tRPC with the application router.
 * Provides a unified endpoint for all tRPC procedure calls.
 * 
 * @param req - The incoming request object
 * @returns The response from the tRPC router
 */
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}), // Context creation for request handling
  });

// Export handler for both GET and POST HTTP methods
export { handler as GET, handler as POST };
