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
        order: "asc",
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
        order: z.number(),
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
          order: input.order,
        },
      });
      return res;
    }),

  swap: privateProcedure
    .input(
      z.object({
        id: z.string(),
        order: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.userId;

      if (user === null) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

    //   console.log("order: ", input.order);

      if (input.order < -1) throw new TRPCError({ code: "CONFLICT" });

      const groups = await ctx.db.group.findMany({
        where: {
          authorId: user,
        },
        orderBy: {
          order: "asc",
        },
      });

      if (groups.length === 0) throw new TRPCError({ code: "NOT_FOUND" });

      if (input.order > groups.length)
        throw new TRPCError({ code: "CONFLICT" });

      const group = groups.find((group) => group.id === input.id);

    //   console.log("groups: ", groups);

      if (!group) throw new TRPCError({ code: "NOT_FOUND" });

      //   if (input.order === -1) return group;
      if (input.order === group.order) return group;

    //   console.log("order: ", input.order);
    //   console.log("g order: ", group.order);

      const orderLeft = group.order > input.order;

    //   console.log("order left? ", orderLeft);

      const index = groups.findIndex((g) => g.id === group.id);

    //   console.log("index: ", index);
    //   console.log("len: ", groups.length);

      let other = null;

      if (orderLeft) {
        other = groups[index - 1];
      } else {
        other = groups[index + 1];
      }

    //   console.log("other: ", other);

      if (!other) return group;

      await ctx.db.group.update({
        where: {
          id: other.id,
        },
        data: {
          order: group.order,
        },
      });

      await ctx.db.group.update({
        where: {
          id: group.id,
        },
        data: {
          order: other.order,
        },
      });

      return group;
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
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.userId;

      if (user === null) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const res = await ctx.db.group.delete({
        where: {
          id: input.id,
          authorId: user,
        },
      });
      return res;
    }),
});
