import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { z } from "zod";

export const tagRouter = createTRPCRouter({
  all: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    const res = await ctx.db.tag.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return res;
  }),


  single: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.userId;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const res = await ctx.db.tag.findUnique({
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

  create: privateProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
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

      const res = await ctx.db.tag.create({
        data: {
          name: input.name,
          description: input.description,
          authorId: user,
        },
      });
      return res;
    }),

  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        amount: z.number(),
        description: z.string(),
        paymentTo: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.userId;

      if (user === null) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const res = await ctx.db.tag.update({
        where: {
          id: input.id,
          authorId: user,
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });
      return res;
    }),

  delete: privateProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const user = ctx.userId;

      if (user === null) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const res = await ctx.db.tag.delete({
        where: {
          id: input,
          authorId: user,
        },
      });
      return res;
    }),
});
