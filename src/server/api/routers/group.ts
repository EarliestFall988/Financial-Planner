import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { z } from "zod";

export const groupRouter = createTRPCRouter({
  getAll: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    const res = await ctx.db.group.findMany({
      where: {
        authorId: userId,
      },
      include: {
        Splits: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return res;
  }),

  getSingle: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.userId;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const res = await ctx.db.group.findUnique({
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
        amount: z.number(),
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

      const res = await ctx.db.group.create({
        data: {
          name: input.name,
          amount: input.amount,
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
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.userId;

      if (user === null) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const res = await ctx.db.group.update({
        where: {
          id: input.id,
          authorId: user,
        },
        data: {
          name: input.name,
          amount: input.amount,
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

      const res = await ctx.db.group.delete({
        where: {
          id: input,
          authorId: user,
        },
      });
      return res;
    }),
});
