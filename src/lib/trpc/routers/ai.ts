import { z } from "zod";
import { router, procedure } from "../init";
import { generateCareerAdvice } from "../../ai/groq";

export const aiRouter = router({
  chat: procedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant", "system"]),
            content: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const response = await generateCareerAdvice(input.messages);
      return { content: response };
    }),
});
