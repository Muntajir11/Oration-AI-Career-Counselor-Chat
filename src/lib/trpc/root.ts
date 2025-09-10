import { router } from "./init";
import { chatRouter } from "./routers/chat";
import { aiRouter } from "./routers/ai";

export const appRouter = router({
  chat: chatRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
