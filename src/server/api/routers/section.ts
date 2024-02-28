import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const sectionRouter = createTRPCRouter({
  getAllSections: privateProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.section.findMany({
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

      const res = await ctx.db.section.findUnique({
        where: {
          id: input.id,
          authorId: userId,
        },
      });

      return res;
    }),

  createNewSection: privateProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        amount: z.number(),
        tagId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const res = await ctx.db.section.create({
        data: {
          name: input.name,
          description: input.description,
          amount: input.amount,
          authorId: userId,
          tags: {
            connect: {
              id: input.tagId,
            },
          },
        },
      });
      return res;
    }),

  Update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        amount: z.number(),
        tagId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const section = await ctx.db.section.findUnique({
        where: {
          id: input.id,
          authorId: userId,
        },
        include: {
          tags: true,
        },
      });

      if (!section) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      if (section.authorId !== userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      section.tags.map((tag) => {
        if (tag.id !== input.tagId) {
          void ctx.db.tag.update({
            where: {
              id: tag.id,
            },
            data: {
              sections: {
                disconnect: {
                  id: section.id,
                },
              },
            },
          });
        }
      });

      const res = await ctx.db.section.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          amount: input.amount,
          tags: {
            connect: {
              id: input.tagId,
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
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const tags = await ctx.db.tag.findMany({
        where: {
          sections: {
            some: {
              id: input.id,
            },
          },
        },
      });

      tags.map((tag) => {
        void ctx.db.tag.update({
          where: {
            id: tag.id,
          },
          data: {
            sections: {
              disconnect: {
                id: input.id,
              },
            },
          },
        });
      });

      const res = await ctx.db.section.delete({
        where: {
          id: input.id,
        },
      });

      return res;
    }),
});
