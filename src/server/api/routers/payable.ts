import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { z } from "zod";
// import { GetBrandImage } from "~/utils/brandImage";

export const payableRouter = createTRPCRouter({
  getMyPayables: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    const res = await ctx.db.payable.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return res;
  }),

  getSinglePayable: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.userId;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const res = await ctx.db.payable.findUnique({
        where: {
          id: input.id,
          authorId: userId,
        },
        include: {
          Budget: true,
          uploadedFiles: {
            select: {
              key: true,
            }
          }
        },
      });

      if (res?.authorId !== userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      return res;
    }),

  createPayable: privateProcedure
    .input(
      z.object({
        name: z.string(),
        amount: z.number(),
        description: z.string(),
        paymentTo: z.string(),
        paymentDate: z.date(),
        budgetSplitId: z.string(),
        fileKeys: z.string().array(),
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

      const files = await ctx.db.uploadedFile.findMany({
        where: {
          key: {
            in: input.fileKeys,
          },
          authorId: user,
        },
      });

      // console.log("test: " + GetBrandImage(input.name));
      const res = await ctx.db.payable.create({
        data: {
          name: input.name,
          amount: input.amount,
          description: input.description,
          payedTo: input.paymentTo,
          date: input.paymentDate,
          authorId: user,
          Budget: {
            connect: {
              id: input.budgetSplitId,
            },
          },
          uploadedFiles: {
            connect: files.map((file) => ({
              id: file.id,
            })),
          }
        },
      });
      return res;
    }),

  updatePayable: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        amount: z.number(),
        description: z.string(),
        paymentTo: z.string(),
        paymentDate: z.date(),
        budgetSplitId: z.string(),
        fileKeys: z.string().array()
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.userId;

      if (user === null) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }


      const files = await ctx.db.uploadedFile.findMany({
        where: {
          key: {
            in: input.fileKeys,
          },
          authorId: user,
        },
      });



      //disconnect the payable from the budget
      await ctx.db.payable.update({
        where: {
          id: input.id,
          authorId: user,
        },
        data: {
          Budget: {
            disconnect: true,
          },
          uploadedFiles: {
            disconnect: files.map((file) => ({
              id: file.id,
            })),
          },
        },
      });


      const res = await ctx.db.payable.update({
        where: {
          id: input.id,
          authorId: user,
        },
        data: {
          name: input.name,
          amount: input.amount,
          payedTo: input.paymentTo,
          description: input.description,
          date: input.paymentDate,
          Budget: {
            connect: {
              id: input.budgetSplitId,
            },
          },
          uploadedFiles: {
            connect: files.map((file) => ({
              id: file.id,
            })),
          }
        },
      });

      return res;

    }),

  deletePayable: privateProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const user = ctx.userId;

      if (user === null) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const files = await ctx.db.uploadedFile.findMany({
        where: {
          payableId: input,
          authorId: user,
        },
      });

      //disconnect the payable from the budget
      await ctx.db.payable.update({
        where: {
          id: input,
          authorId: user,
        },
        data: {
          Budget: {
            disconnect: true,
          },
          uploadedFiles: {
            disconnect: files.map((file) => ({
              id: file.id,
            })),
          }
        },
      });


      const res = await ctx.db.payable.delete({
        where: {
          id: input,
          authorId: user,
        },
      });
      return res;
    }),
});
