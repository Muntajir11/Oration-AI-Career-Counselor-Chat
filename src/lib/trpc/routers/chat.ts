import { z } from "zod";
import { router, procedure } from "../init";
import { db, schema } from "../../db/index";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export const chatRouter = router({
  // Get all chat sessions
  getSessions: procedure.query(async () => {
    const sessions = await db
      .select()
      .from(schema.chatSessions)
      .orderBy(desc(schema.chatSessions.updatedAt));
    return sessions;
  }),

  // Create a new chat session
  createSession: procedure
    .input(
      z.object({
        title: z.string().min(1),
        userId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const sessionId = nanoid();
      const newSession = await db
        .insert(schema.chatSessions)
        .values({
          id: sessionId,
          title: input.title,
          userId: input.userId,
        })
        .returning();
      return newSession[0];
    }),

  // Get messages for a specific chat session
  getMessages: procedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const messages = await db
        .select()
        .from(schema.messages)
        .where(eq(schema.messages.chatSessionId, input.sessionId))
        .orderBy(schema.messages.createdAt);
      return messages;
    }),

  // Add a message to a chat session
  addMessage: procedure
    .input(
      z.object({
        sessionId: z.string(),
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const messageId = nanoid();
      const newMessage = await db
        .insert(schema.messages)
        .values({
          id: messageId,
          chatSessionId: input.sessionId,
          role: input.role,
          content: input.content,
        })
        .returning();

      // Update session's updatedAt timestamp
      await db
        .update(schema.chatSessions)
        .set({ updatedAt: new Date() })
        .where(eq(schema.chatSessions.id, input.sessionId));

      return newMessage[0];
    }),

  // Delete a chat session
  deleteSession: procedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .delete(schema.chatSessions)
        .where(eq(schema.chatSessions.id, input.sessionId));
      return { success: true };
    }),
});
