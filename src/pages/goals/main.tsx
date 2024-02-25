import { ArrowRightIcon, RectangleGroupIcon } from "@heroicons/react/24/solid";
import { type NextPage } from "next";
import Head from "next/head";
import { StickyHeader } from "~/components/header";

export const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Goals | Finance Pro</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-[100vh] bg-zinc-900 text-white">
        <StickyHeader title="Goals" backButton />
        <div className="h-[5vh]" />
        <div className="grid min-h-[95vh] w-full items-center justify-center">
          <div className="flex h-[10vh] w-[50vw] items-center justify-center gap-2 rounded bg-zinc-800 p-2 font-semibold">
            <div className="flex items-center justify-center gap-2">
              <RectangleGroupIcon className="h-7 w-7" />
              <p className="text-3xl font-semibold">Sections</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
