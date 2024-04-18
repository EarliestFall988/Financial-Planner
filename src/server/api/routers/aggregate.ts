import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { type Prisma, type Receivable } from "@prisma/client";
import { z } from "zod";
// import { SplitTotal } from "../types"; // Add the missing import statement for the SplitTotal type

type PayablesWithUploadedFilesType = Prisma.PayableGetPayload<{ include: { uploadedFiles: true, Budget: true } }>

export type payable = {
  type: "payable";
  data: PayablesWithUploadedFilesType;
};

export type receivable = {
  type: "receivable";
  data: Receivable;
};

const sortPayablesAndReceivablesByDate = (
  payables: PayablesWithUploadedFilesType[],
  receivables: Receivable[],
) => {
  const ps = [] as payable[];
  const rs = [] as receivable[];

  payables.forEach((p) => {
    ps.push({
      type: "payable",
      data: p,
    });
  });

  receivables.forEach((r) => {
    rs.push({
      type: "receivable",
      data: r,
    });
  });

  const all = [...ps, ...rs];
  all.sort((a, b) => {
    return a.data.updatedAt < b.data.updatedAt ? 1 : -1;
  });
  return all;
};

export type SplitTotal = {
  amount: number;
  spent: number;
  name: string;
  budgetSplitId: string;
};

type Amount = {
  amount: number;
};

export const aggregateRouter = createTRPCRouter({
  getMyActivity: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    const receivables = await ctx.db.receivable.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const payables = await ctx.db.payable.findMany({
      where: {
        authorId: userId,
      },
      include: {
        uploadedFiles: true,
        Budget: true
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const result = sortPayablesAndReceivablesByDate(payables, receivables);
    return result;
  }),

  getBalance: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    const receivables = await ctx.db.receivable.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const payables = await ctx.db.payable.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const totalPayables = payables.reduce((acc, curr) => {
      return acc + curr.amount.toNumber();
    }, 0);

    const totalReceivables = receivables.reduce((acc, curr) => {
      return acc + curr.amount.toNumber();
    }, 0);

    return totalReceivables - totalPayables;
  }),

  getTotalSpent: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    const date = new Date();
    const thisMonth = date.getMonth() + 1;
    const thisYear = date.getFullYear();

    const result = await ctx.db.$queryRawUnsafe<Amount[]>(
      `
    SELECT DISTINCT SUM("Payable"."amount") AS amount
    FROM "Payable"  
    WHERE EXTRACT(MONTH FROM "Payable"."date") = $1 AND EXTRACT(YEAR FROM "Payable"."date") = $2 AND "Payable"."authorId" = $3
    `,
      thisMonth,
      thisYear,
      userId,
    );

    const a = result[0]?.amount ?? 0;

    console.log(a);

    return a;
  }),

  getTotalBySplit: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    const date = new Date();
    const thisMonth = date.getMonth() + 1;
    const thisYear = date.getFullYear();

    const result = await ctx.db.$queryRawUnsafe<SplitTotal[]>(
      `
    SELECT DISTINCT (SUM(COALESCE("Receivable"."amount", 0)) + SUM(COALESCE("Split"."amount", 0)) - SUM(COALESCE("Payable"."amount",0))) AS amount, 
            SUM(COALESCE("Payable"."amount",0)) AS spent, COALESCE("Split"."name", 'Other') as name, COALESCE("Payable"."budgetId", 'o') as budgetId
    FROM "Payable" FULL OUTER JOIN "Split" ON "Split"."id"="Payable"."budgetId" FULL OUTER JOIN "Receivable" ON "Receivable"."budgetId"="Split"."id"
    WHERE EXTRACT(MONTH FROM "Payable"."date") = $1 AND EXTRACT(YEAR FROM "Payable"."date") = $2 AND "Payable"."authorId" = $3
    GROUP BY "Split"."name", "Payable"."budgetId"
    ORDER BY "amount" ASC;
    `,
      thisMonth,
      thisYear,
      userId,
    );

    return result;
  }),

  getDataToExport: privateProcedure
    .input(
      z.object({
        includedBudgetPartitionIds: z.string().array(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.userId;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const payables = await ctx.db.payable.findMany({
        where: {
          AND: {
            authorId: userId,
            budgetId: {
              in: input.includedBudgetPartitionIds,
            },
          },
        },
        include: {
          Budget: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      const receivables = await ctx.db.receivable.findMany({
        where: {
          AND: {
            authorId: userId,
            budgetId: {
              in: input.includedBudgetPartitionIds,
            },
          },
        },
        include: {
          Budget: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      return {
        payables,
        receivables,
      };
    }),
});
