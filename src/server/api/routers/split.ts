import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { z } from "zod";

export const splitRouter = createTRPCRouter({
  getAll: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    const res = await ctx.db.split.findMany({
      where: {
        authorId: userId,
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

      const res = await ctx.db.split.findUnique({
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
        groupId: z.string(),
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

      const res = await ctx.db.split.create({
        data: {
          name: input.name,
          amount: input.amount,
          description: input.description,
          Group: {
            connect: {
              id: input.groupId,
            },
          },
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
        groupId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.userId;

      if (user === null) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      await ctx.db.split.update({
        where: {
          id: input.id,
          authorId: user,
        },
        data: {
          Group: {
            disconnect: {
              id: input.groupId,
            },
          },
        },
      });

      const res = await ctx.db.split.update({
        where: {
          id: input.id,
          authorId: user,
        },
        data: {
          name: input.name,
          amount: input.amount,
          description: input.description,
          Group: {
            connect: {
              id: input.groupId,
            },
          },
        },
      });
      return res;
    }),

  delete: privateProcedure
    .input(
      z.object({
        id: z.string(),
        groupId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.userId;

      if (user === null) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      await ctx.db.split.update({
        where: {
          id: input.id,
          authorId: user,
        },
        data: {
          Group: {
            disconnect: {
              id: input.groupId,
            },
          },
        },
      });

      const res = await ctx.db.split.delete({
        where: {
          id: input.id,
          authorId: user,
        },
      });
      return res;
    }),
});
