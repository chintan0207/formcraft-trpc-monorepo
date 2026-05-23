import { publicProcedure, router } from "./trpc";

import { healthRouter } from "./routes/health/route";
import z, { email } from "zod";

export const serverRouter = router({
  health: healthRouter,
  chaiCode: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .output(z.object({ message: z.string() }))
    .query(async ({ input }) => {
      return { message: `hello ${input.email}` };
    }),
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
