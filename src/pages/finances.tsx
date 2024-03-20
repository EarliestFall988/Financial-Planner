import { SignIn, UserButton, useClerk } from "@clerk/nextjs";
import { type NextPage } from "next";
import {
  AdjustmentsVerticalIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import Head from "next/head";
import { api } from "~/utils/api";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { PropagateSpinner } from "~/components/PropagateSpinner";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import calendar from "dayjs/plugin/calendar";
import { formatCurrency } from "~/utils/currency";
import type {
  SplitTotal,
  payable,
  receivable,
} from "~/server/api/routers/aggregate";

import * as Popover from "@radix-ui/react-popover";
import { type ReactNode } from "react";

dayjs.extend(relativeTime);
dayjs.extend(calendar);

const TransactionItem: React.FC<{ itm: payable | receivable }> = ({ itm }) => {
  return (
    <Link
      href={"/" + itm.type + "s/" + itm.data.id}
      key={itm.data.id}
      className=" flex items-center justify-between border-b border-zinc-800 p-2 transition duration-100 hover:bg-zinc-800"
    >
      <div>
        <p className="text-lg font-semibold">{itm.data.name}</p>
        {itm.type === "payable" && (
          <p className="text-zinc-300">{itm.data.payedTo ?? ""}</p>
        )}

        {itm.type === "receivable" && (
          <p className="text-zinc-300">{itm.data.receivedFrom ?? ""}</p>
        )}
      </div>

      <p className="hidden text-sm text-zinc-300 lg:block">
        {itm.data.description}
      </p>
      {itm.type === "payable" && (
        <div className="flex flex-col items-end">
          <p className="text-lg font-semibold text-red-500">
            ({formatCurrency.format(parseFloat(itm.data.amount.toString()))})
          </p>
          <p className="text-sm text-zinc-300">
            {dayjs(itm.data.updatedAt).calendar()}
          </p>
        </div>
      )}
      {itm.type === "receivable" && (
        <div className="flex flex-col items-end">
          <p className="text-lg font-semibold text-green-500">
            ${itm.data.amount.toString()}
          </p>
          <p className="text-sm text-zinc-300">
            {dayjs(itm.data.updatedAt).calendar()}
          </p>
        </div>
      )}
    </Link>
  );
};

const Balance: React.FC<{ abbreviated?: boolean; className?: string }> = ({
  abbreviated,
  className,
}) => {
  const { data: balance, isLoading: loadingBalance } =
    api.aggregate.getBalance.useQuery();

  return (
    <>
      {loadingBalance && <PropagateSpinner />}
      {!loadingBalance && (
        <div
          className={
            className ? className : "flex items-end justify-start gap-2"
          }
        >
          <p className="text-sm text-zinc-400">
            {abbreviated ? "Bal" : "Balance"}
          </p>
          {(balance ?? 0) > 0 && (
            <p className="text-lg font-semibold text-green-500">
              {formatCurrency.format(Math.abs(balance ?? 0))}
            </p>
          )}
          {(balance ?? 0) < 0 && (
            <p className="text-lg font-semibold text-red-500">
              ({formatCurrency.format(Math.abs(balance ?? 0))})
            </p>
          )}
        </div>
      )}
    </>
  );
};

const SplitItem: React.FC<{
  name: string;
  total: number;
  spent: number;
  className?: string;
}> = ({ className, name, total, spent }) => {
  return (
    <div
      className={
        className ? className : "flex flex-col items-end justify-start gap-2"
      }
    >
      <p className="text-sm text-zinc-400">{name}</p>
      {(total ?? 0) > 0 && (
        <p className="text-lg font-semibold text-green-500">
          {formatCurrency.format(Math.abs(total ?? 0))}{" "}
          <span className="text-sm text-zinc-500">left</span>
        </p>
      )}
      {(total ?? 0) < 0 && (
        <p className="text-lg font-semibold text-red-500">
          ({formatCurrency.format(Math.abs(total ?? 0))})
        </p>
      )}
      {spent !== 0 && total > 0 && (
        <p className="text-sm text-zinc-500">
          ({formatCurrency.format(Math.abs(spent ?? 0))})
        </p>
      )}
    </div>
  );
};

const MobileNav = () => {
  return (
    <div className="fixed bottom-0 w-full rounded-t-lg border-t border-zinc-500 bg-zinc-900 p-2 md:hidden">
      <div className="flex items-center justify-between">
        <div className="flex w-full items-center justify-around gap-2">
          <Link
            href="/payables/new"
            className="flex items-center gap-2 rounded p-3 transition duration-300 hover:bg-zinc-800"
          >
            <ArrowLeftStartOnRectangleIcon className="h-5 w-5 text-white" />
            Pay
          </Link>
          <Link
            href="/receivables/new"
            className="flex items-center gap-2 rounded p-3 transition duration-300 hover:bg-zinc-800"
          >
            <ArrowRightEndOnRectangleIcon className="h-5 w-5 text-white" />
            Fund
          </Link>
          <Link
            href="/my-budget/all"
            className="flex items-center gap-2 rounded p-3 transition duration-300 hover:bg-zinc-800"
          >
            <AdjustmentsVerticalIcon className="h-5 w-5 text-white" />
            Budget
          </Link>
        </div>        
      </div>
    </div>
  );
};

const MobilePopover: React.FC<{
  children: ReactNode;
  splitData: SplitTotal[] | undefined;
  spentResult: number | undefined;
}> = ({ children, splitData, spentResult }) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade w-[260px] rounded border border-zinc-800 bg-zinc-950/70 backdrop-blur p-5 outline-none will-change-[transform,opacity]"
          sideOffset={9}
        >
          <div className="flex flex-col">
            <div className="text-sm text-zinc-400">Spent</div>
            <div className="text-amber-500">
              {formatCurrency.format(Math.abs(spentResult ?? 0))}
            </div>
            <div className="my-4 border-b border-zinc-800" />
            <p className="text-sm font-semibold text-zinc-200">Budget</p>
            {splitData?.map((itm) => {
              return (
                <SplitItem
                  key={itm.budgetSplitId}
                  name={itm.name}
                  total={itm.amount}
                  spent={itm.spent}
                  className="block py-2"
                ></SplitItem>
              );
            })}
          </div>

          <Popover.Arrow className="fill-zinc-950" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

const SideNav = () => {
  return (
    <div className="hidden w-44 flex-col gap-2 p-2 md:flex">
      <div className="h-[10vh]" />
      <Link
        href="/payables/new"
        className="flex items-center gap-2 rounded p-3 transition duration-300 hover:bg-zinc-800"
      >
        <ArrowLeftStartOnRectangleIcon className="h-5 w-5 text-white" />
        Pay
      </Link>
      <Link
        href="/receivables/new"
        className="flex items-center gap-2 rounded p-3 transition duration-300 hover:bg-zinc-800"
      >
        <ArrowRightEndOnRectangleIcon className="h-5 w-5 text-white" />
        Fund
      </Link>
      <Link
        href="/my-budget/all"
        className="flex items-center gap-2 rounded p-3 transition duration-300 hover:bg-zinc-800"
      >
        <AdjustmentsVerticalIcon className="h-5 w-5 text-white" />
        Budget
      </Link>
    </div>
  );
};

const Page: NextPage = () => {
  const { user } = useClerk();

  const { data, isLoading, isError } = api.aggregate.getMyActivity.useQuery();

  const { data: splitData } = api.aggregate.getTotalBySplit.useQuery();

  const { data: spentResult } = api.aggregate.getTotalSpent.useQuery();

  const [animParent] = useAutoAnimate();

  if (!user) {
    return (
      <div>
        <SignIn />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Recent Activity | Finance Pro</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-[100vh] bg-zinc-900 text-white">
        <div className="fixed top-0 z-10 flex w-full items-start justify-between bg-zinc-900/60 p-2 backdrop-blur-sm">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <div className="hidden items-center justify-center gap-4 md:flex">
            <UserButton />
          </div>
          <div className="flex items-center justify-center gap-4 md:hidden">
            <MobilePopover spentResult={spentResult} splitData={splitData}>
              <div className="rounded p-1 transition duration-300 hover:bg-zinc-800">
                <Balance abbreviated />
              </div>
            </MobilePopover>
          </div>
        </div>
        <div className="mx-auto flex gap-2 p-2 lg:w-5/6 lg:p-0 xl:w-2/3">
          <SideNav />
          <div
            ref={animParent}
            className="hide-scrollbar h-[100vh] w-full overflow-auto"
          >
            <div className="h-[10vh]" />
            {!isLoading &&
              !isError &&
              data?.map((itm) => {
                return <TransactionItem key={itm.data.id} itm={itm} />;
              })}

            {isLoading && (
              <div className="flex h-[45vh] items-center justify-center">
                <PropagateSpinner />
              </div>
            )}
            {isError && (
              <div className="flex h-[45vh] items-center justify-center">
                <div className="flex items-center justify-center gap-2 rounded-full bg-red-800 p-4 text-white md:w-1/2">
                  <ExclamationTriangleIcon className="h-10 w-10 rotate-12 " />
                  <p className="text-2xl">Error loading</p>
                </div>
              </div>
            )}

            {data && data.length === 0 && !isLoading && !isError && (
              <div className="flex h-[45vh] items-center justify-center rounded">
                <div>
                  <p className="text-3xl font-semibold text-blue-500">
                    No Activity
                  </p>
                  <p className="text-zinc-400">
                    Select New Payable or New Receivable to get started
                  </p>
                </div>
              </div>
            )}

            <div className="h-[20vh]" />
          </div>
          <div className="hidden w-44 p-2 md:block">
            <div className="h-[10vh]" />
            <Balance className="block" />
            <div className="text-sm text-zinc-400">Spent</div>
            <div className="text-amber-500">
              {formatCurrency.format(Math.abs(spentResult ?? 0))}
            </div>
            <div className="my-4 border-b border-zinc-800" />
            <p className="text-sm font-semibold text-zinc-200">Budget</p>
            {splitData?.map((itm) => {
              return (
                <SplitItem
                  key={itm.budgetSplitId}
                  name={itm.name}
                  total={itm.amount}
                  spent={itm.spent}
                  className="block py-2"
                ></SplitItem>
              );
            })}
          </div>
        </div>
        <MobileNav />
      </main>
    </>
  );
};

export default Page;
