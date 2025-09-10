import { z } from "zod";
import { router, procedure } from "../init";
import { db, schema } from "../../db/index";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const userRouter = router({
  // Create or update a user (for Supabase integration)
  createUser: procedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().email(),
        name: z.string().min(1),
        supabaseId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // First check if user already exists by supabaseId or email
      const existingUser = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, input.email))
        .limit(1);

      if (existingUser.length > 0) {
        const user = existingUser[0];
        // Check if user is active
        if (user.isActive !== "true") {
          throw new Error("User account is deactivated");
        }
        
        // Update existing user
        const updatedUser = await db
          .update(schema.users)
          .set({
            name: input.name,
            supabaseId: input.supabaseId || input.id,
            updatedAt: new Date(),
          })
          .where(eq(schema.users.id, user.id))
          .returning();
        return updatedUser[0];
      } else {
        // Create new user
        const newUser = await db
          .insert(schema.users)
          .values({
            name: input.name,
            email: input.email,
            supabaseId: input.supabaseId || input.id,
            isActive: "true",
          })
          .returning();
        return newUser[0];
      }
    }),

  // Register a new user with email/password
  register: procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Check if user already exists
        const existingUser = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.email, input.email))
          .limit(1);

        if (existingUser.length > 0) {
          throw new Error("User already exists with this email");
        }

        // Hash password
        const passwordHash = await bcrypt.hash(input.password, 10);

        // Create new user
        const newUser = await db
          .insert(schema.users)
          .values({
            name: input.name,
            email: input.email,
            passwordHash,
            isActive: "true",
          })
          .returning();
        
        return { 
          id: newUser[0].id, 
          email: newUser[0].email, 
          name: newUser[0].name 
        };
      } catch (error) {
        console.error("Registration error:", error);
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("Failed to register user");
      }
    }),

  // Authenticate user
  authenticate: procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Find user by email
      const user = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, input.email))
        .limit(1);

      if (user.length === 0) {
        throw new Error("Invalid email or password");
      }

      const foundUser = user[0];

      // Check if user is active
      if (foundUser.isActive !== "true") {
        throw new Error("User account is deactivated");
      }

      // Check if password exists (for database auth)
      if (!foundUser.passwordHash) {
        throw new Error("Please use social login for this account");
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(input.password, foundUser.passwordHash);
      
      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      return {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
      };
    }),

  // Check if user exists and is active (for Supabase auth)
  checkUserExists: procedure
    .input(z.object({ 
      email: z.string().email().optional(),
      supabaseId: z.string().optional(),
    }))
    .query(async ({ input }) => {
      if (!input.email && !input.supabaseId) {
        return { exists: false, isActive: false };
      }

      let user;
      if (input.supabaseId) {
        const users = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.supabaseId, input.supabaseId))
          .limit(1);
        user = users[0];
      } else if (input.email) {
        const users = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.email, input.email))
          .limit(1);
        user = users[0];
      }

      if (!user) {
        return { exists: false, isActive: false };
      }

      return { 
        exists: true, 
        isActive: user.isActive === "true",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      };
    }),

  // Get user by ID
  getUser: procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const user = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, input.id))
        .limit(1);
      return user[0] || null;
    }),
});
