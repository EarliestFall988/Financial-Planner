import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProcedure } from "../trpc";
import type { Payable, Receivable } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export type payable = {
  type: "payable";
  data: Payable;
};

export type receivable = {
  type: "receivable";
  data: Receivable;
};

const sortPayablesAndReceivablesByDate = (
  payables: Payable[],
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
});
