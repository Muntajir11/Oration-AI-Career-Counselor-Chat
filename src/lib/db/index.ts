/**
 * Database Configuration
 * 
 * This module sets up the database connection using Drizzle ORM with PostgreSQL.
 * It configures the connection client and exports the database instance for
 * use throughout the application.
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Validate required environment variables
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

/**
 * PostgreSQL Client Configuration
 * 
 * Creates a PostgreSQL client connection with optimized settings
 * for the application's database operations.
 */
const client = postgres(process.env.DATABASE_URL, {
  prepare: false, // Disable prepared statements for better compatibility
});

/**
 * Database Instance
 * 
 * Drizzle ORM database instance configured with schema definitions
 * for type-safe database operations.
 */
export const db = drizzle(client, { schema });

export { schema };
