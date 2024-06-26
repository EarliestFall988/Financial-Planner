import { SignIn, UserButton, useClerk } from "@clerk/nextjs";
import { type NextPage } from "next";
import {
  AdjustmentsVerticalIcon,
  ArrowDownTrayIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  Bars3Icon,
  ExclamationTriangleIcon,
  PaperClipIcon,
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

import * as Tooltip from "@radix-ui/react-tooltip";

import * as Popover from "@radix-ui/react-popover";
import { type ReactNode } from "react";
import { CurrencyTextComponent } from "~/components/CurrencyTextComponent";

dayjs.extend(relativeTime);
dayjs.extend(calendar);

const TransactionDataTooltip: React.FC<{
  children: ReactNode;
  name: string;
}> = ({ children, name }) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="rounded border-zinc-500 bg-blue-600/20 p-2 text-white backdrop-blur-lg data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade  data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
            <p className="text-lg">{name}</p>
            <Tooltip.Arrow className="fill-blue-600/40" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

const TransactionItem: React.FC<{ itm: payable | receivable }> = ({ itm }) => {
  return (
    <Link
      href={"/" + itm.type + "s/" + itm.data.id}
      key={itm.data.id}
      className={`flex items-center justify-between ${
        itm.type === "receivable"
          ? "rounded-xl bg-gradient-to-r from-green-900/50 to-blue-900/50"
          : "border-b border-zinc-800"
      }  p-2 transition duration-100 hover:bg-zinc-800`}
    >
      <div className="w-3/4 lg:w-1/3">
        {itm.type === "payable" && (
          <>
            <div className="flex w-full items-center justify-start gap-1">
              <TransactionDataTooltip name={itm.data.name}>
                <div className="max-w-[70%] md:max-w-52">
                  <p className="truncate text-lg font-semibold">
                    {itm.data.name}
                  </p>
                </div>
              </TransactionDataTooltip>
            </div>
            <div className="flex items-center justify-start gap-1 text-zinc-300">
              <p className="truncate text-zinc-300">{itm.data.payedTo ?? ""}</p>

              {itm.data.Budget && (
                <>
                  <p>•</p>
                  <div className="flex max-w-14 italic md:max-w-28">
                    <p className="truncate text-ellipsis whitespace-nowrap text-xs text-zinc-300">
                      {itm.data.Budget?.name}
                    </p>
                  </div>
                </>
              )}
              {itm.data.uploadedFiles.length > 0 && (
                <PaperClipIcon className="h-3 w-3 text-zinc-300" />
              )}
            </div>
          </>
        )}

        {itm.type === "receivable" && (
          <p className="text-zinc-300">{itm.data.receivedFrom ?? ""}</p>
        )}
      </div>

      <TransactionDataTooltip name={itm.data.description}>
        <p className="hidden h-full w-1/3 truncate text-sm text-zinc-300 lg:block">
          {itm.data.description}
        </p>
      </TransactionDataTooltip>
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

const Overview: React.FC<{ abbreviated?: boolean; className?: string }> = ({
  abbreviated,
  className,
}) => {
  const { data: balance, isLoading: loadingBalance } =
    api.aggregate.getBalance.useQuery();

  const { data, isLoading } =
    api.aggregate.getCashflowToSpentDifferenceByWeek.useQuery();

  return (
    <>
      {(loadingBalance || isLoading) && <PropagateSpinner />}
      {!loadingBalance && !isLoading && (
        <div
          className={
            className ? className : "flex items-end justify-start gap-2"
          }
        >
          <p className="text-sm text-zinc-400">
            {abbreviated ? "Bal" : "Balance"}
          </p>
          <CurrencyTextComponent value={balance} />
          <div className="h-3"></div>
          <p className="text-sm text-zinc-400">
            {abbreviated ? "In-out" : "In-out this week"}
          </p>
          <CurrencyTextComponent value={data} className="text-sm" />
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
      <CurrencyTextComponent value={total} />
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
    <div className="fixed bottom-0 w-full bg-zinc-950 p-2 md:hidden">
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
  balance: number | undefined;
}> = ({ children, splitData, spentResult, balance }) => {
  const { data, isLoading } =
    api.aggregate.getCashflowToSpentDifferenceByWeek.useQuery();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="w-[40vw] rounded bg-zinc-950 p-5 outline-none will-change-[transform,opacity] data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade"
          sideOffset={9}
        >
          <div className="flex flex-col">
            <div className="text-sm text-zinc-400">Balance</div>
            <CurrencyTextComponent value={balance} />
            <div className="text-sm text-zinc-400">Spent</div>
            <div className="text-amber-500">
              {formatCurrency.format(Math.abs(spentResult ?? 0))}
            </div>
            {!isLoading && (
              <>
                <div className="text-sm text-zinc-400">in-out this wk</div>
                <CurrencyTextComponent value={data} />
              </>
            )}
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
            <div className="my-4 border-b border-zinc-800" />
            <Link
              href="/export"
              className="flex items-center gap-2 rounded p-3 text-white transition duration-300 hover:bg-zinc-800"
            >
              <ArrowDownTrayIcon className="h-5 w-5 text-white" />
              Export
            </Link>
          </div>

          <Popover.Arrow className="fill-emerald-950" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

const SideNav = () => {
  const { user } = useClerk();

  return (
    <div className="hidden w-44 flex-col justify-between gap-2 p-2 md:flex">
      <div>
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
        <Link
          href="/export"
          className="flex items-center gap-2 rounded p-3 transition duration-300 hover:bg-zinc-800"
        >
          <ArrowDownTrayIcon className="h-5 w-5 text-white" />
          Export
        </Link>
      </div>
      <div>
        <div className="hidden items-center p-3 rounded gap-2 md:flex">
          <UserButton />
          <p className="text-white">Account</p>
        </div>
        <div className="h-[5vh]" />
      </div>
    </div>
  );
};

const Page: NextPage = () => {
  const { user } = useClerk();

  const { data, isLoading, isError } = api.aggregate.getMyActivity.useQuery();

  const { data: balance } = api.aggregate.getBalance.useQuery();

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
        <div className="fixed top-0 z-10 flex w-full items-center justify-between bg-zinc-900/60 p-2 backdrop-blur-sm lg:block">
          <div className="flex items-start justify-between px-8 pt-3 lg:mx-auto lg:w-1/2">
            <div>
              <h2 className="text-lg font-semibold lg:text-3xl">Activity</h2>
              <p className="text-xs">Hello, {user.firstName}</p>
            </div>
          </div>
          {isLoading ? (
            <div></div>
          ) : (
            <div className="flex items-center justify-center gap-4 md:hidden">
              <MobilePopover
                spentResult={spentResult}
                splitData={splitData}
                balance={balance}
              >
                <Bars3Icon className="h-9 p-1" />
              </MobilePopover>
            </div>
          )}
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
          <div className="hidden h-[70vh] w-44 p-2 md:block">
            <div className="h-[10vh]" />
            <Overview className="block" />
            <div className="text-sm text-zinc-400">Spent</div>
            <div className="text-amber-500">
              {formatCurrency.format(Math.abs(spentResult ?? 0))}
            </div>
            <div className="my-4 border-b border-zinc-800" />
            <div className="h-full w-full overflow-auto">
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
        </div>
        <MobileNav />
      </main>
    </>
  );
};

export default Page;
