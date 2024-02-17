import { SignIn, useClerk } from "@clerk/nextjs";
import { type NextPage } from "next";
import { ExclamationTriangleIcon, PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Head from "next/head";
import { api } from "~/utils/api";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { PropagateSpinner } from "~/components/PropagateSpinner";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const Page: NextPage = () => {
  const { user } = useClerk();

  const { data: balance } = api.aggregate.getBalance.useQuery();

  const { data, isLoading, isError } = api.aggregate.getMyActivity.useQuery();

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
        <title>Overview | FinPlan</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-[100vh] bg-zinc-900 text-white">
        <div className="flex items-center justify-between border-b border-zinc-600 bg-zinc-700 p-2 font-semibold drop-shadow-md">
          <h1 className="text-2xl">Overview</h1>
        </div>
        <div className="flex gap-2 p-5">
          <Link
            href="/payables/new"
            className="flex items-center gap-2 rounded border border-zinc-600 bg-zinc-700 p-3 transition duration-100 hover:scale-105 hover:bg-zinc-600"
          >
            <PlusIcon className="h-5 w-5 text-white" />
            New Payable
          </Link>
          <Link
            href="/receivables/new"
            className="flex items-center gap-2 rounded border border-zinc-600 bg-zinc-700 p-3 transition duration-100 hover:scale-105 hover:bg-zinc-600"
          >
            <PlusIcon className="h-5 w-5 text-white" />
            New Receivable
          </Link>
        </div>
        <div className="mx-auto p-4 md:w-2/3 2xl:w-1/2">
          <div className="flex items-end justify-between text-lg">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <div>
              <p className="text-sm text-end text-zinc-400">Balance</p>
              {(balance ?? 0) > 0 && (
                <p className="text-green-500">
                  {formatter.format(Math.abs(balance ?? 0))}
                </p>
              )}
              {(balance ?? 0) < 0 && (
                <p className="text-red-500">
                  ({formatter.format(Math.abs(balance ?? 0))})
                </p>
              )}
            </div>
          </div>
          <div ref={animParent}>
            {!isLoading &&
              !isError &&
              data?.map((itm) => {
                return (
                  <Link
                    href={"/" + itm.type + "s/" + itm.data.id}
                    key={itm.data.id}
                    className="mt-2 flex items-center justify-between rounded border border-zinc-600 bg-zinc-700 p-2 transition duration-300 hover:scale-105 hover:bg-zinc-600"
                  >
                    <div>
                      <p className="text-lg font-semibold">{itm.data.name}</p>
                      {itm.type === "payable" && (
                        <p className="text-zinc-300">
                          {itm.data.payedTo ?? ""}
                        </p>
                      )}

                      {itm.type === "receivable" && (
                        <p className="text-zinc-300">
                          {itm.data.receivedFrom ?? ""}
                        </p>
                      )}
                    </div>

                    <p className="hidden text-sm text-zinc-300 lg:block">
                      {itm.data.description}
                    </p>
                    <p className="text-sm text-zinc-300">
                      ({dayjs(itm.data.updatedAt).fromNow()})
                    </p>
                    {itm.type === "payable" && (
                      <div>
                        <p className="text-lg font-semibold text-red-500">
                          (${itm.data.amount.toString()})
                        </p>
                      </div>
                    )}
                    {itm.type === "receivable" && (
                      <div>
                        <p className="text-lg font-semibold text-green-500">
                          ${itm.data.amount.toString()}
                        </p>
                      </div>
                    )}
                  </Link>
                );
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
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
