import { createTRPCRouter, privateProcedure } from "../trpc";

export const payableRouter = createTRPCRouter({
  getAllPayables: privateProcedure.query(({ ctx }) => {
    return {
      test: "test",
    };
  }),
});
