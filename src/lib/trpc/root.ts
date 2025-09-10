import { router } from "./init";
import { chatRouter } from "./routers/chat";
import { aiRouter } from "./routers/ai";
import { userRouter } from "./routers/user";

export const appRouter = router({
  chat: chatRouter,
  ai: aiRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
