import { createTRPCRouter } from "~/server/api/trpc";
import { payableRouter } from "./routers/payable";
import { receivableRouter } from "./routers/receivable";
import { aggregateRouter } from "./routers/aggregate";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  payable: payableRouter,
  receivable: receivableRouter,
  aggregate: aggregateRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
