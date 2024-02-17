import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { z } from "zod";

export const receivableRouter = createTRPCRouter({
    getMyReceivables: privateProcedure.query(async ({ ctx }) => {
        const userId = ctx.userId;
    
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
          });
        }
    
        const res = await ctx.db.receivable.findMany({
          where: {
            authorId: userId,
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
    
        return res;
      }),
    
    
      getSingleReceivable: privateProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
          const userId = ctx.userId;
    
          if (!userId) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
            });
          }
    
          const res = await ctx.db.receivable.findUnique({
            where: {
              id: input.id,
              authorId: userId,
            },
          });
    
          if (res?.authorId !== userId) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
            });
          }
    
          return res;
        }),
    
      createReceivable: privateProcedure
        .input(
          z.object({
            name: z.string(),
            amount: z.number(),
            description: z.string(),
            paymentFrom: z.string(),
          }),
        )
        .mutation(async ({ input, ctx }) => {
          const user = ctx.userId;
    
          console.log(user);
    
          if (user === null) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
            });
          }
    
          const res = await ctx.db.receivable.create({
            data: {
              name: input.name,
              amount: input.amount,
              description: input.description,
              receivedFrom: input.paymentFrom,
              authorId: user,
            },
          });
          return res;
        }),
    
      updateReceivable: privateProcedure
        .input(
          z.object({
            id: z.string(),
            name: z.string(),
            amount: z.number(),
            description: z.string(),
            paymentFrom: z.string(),
          }),
        )
        .mutation(async ({ input, ctx }) => {
          const user = ctx.userId;
    
          if (user === null) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
            });
          }
    
          const res = await ctx.db.receivable.update({
            where: {
              id: input.id,
              authorId: user,
            },
            data: {
              name: input.name,
              amount: input.amount,
              receivedFrom: input.paymentFrom,
              description: input.description,
            },
          });
          return res;
        }),
    
      deleteReceivable: privateProcedure
        .input(z.string())
        .mutation(async ({ input, ctx }) => {
          const user = ctx.userId;
    
          if (user === null) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
            });
          }
    
          const res = await ctx.db.receivable.delete({
            where: {
              id: input,
              authorId: user,
            },
          });
          return res;
        }),
});
