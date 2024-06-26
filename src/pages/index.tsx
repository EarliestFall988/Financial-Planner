import { SignInButton, UserButton, useClerk } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const { user } = useClerk();

  return (
    <>
      <Head>
        <title>Landing Page | Finance Pro</title>
      </Head>
      <main className="h-[100vh] bg-black">
        {user && (
          <div className="fixed top-0 flex h-10 w-full justify-end p-2">
            <UserButton />
          </div>
        )}
        <div className="absolute bottom-0 flex h-[70vh] w-full items-start justify-center bg-black py-20 lg:h-[100vh] lg:w-2/5 lg:items-center lg:p-0">
          {user ? (
            <div className="flex flex-col items-start justify-center gap-2">
              <h1 className="text-lg font-semibold text-white">
                Hey {user.fullName}!
              </h1>
              <Link
                href="/finances"
                className="rounded hover:scale-105 duration-200 transition bg-gradient-to-tr from-sky-700 to-emerald-700 p-4 text-3xl font-semibold text-white"
              >
                View Budget
              </Link>
            </div>
          ) : (
            <div className="rounded bg-blue-500 p-2 text-center font-semibold text-white">
              <SignInButton />
            </div>
          )}
        </div>
        <div className="bg-hero h-[30vh] bg-right bg-no-repeat lg:h-[100vh] lg:w-full lg:bg-contain"></div>
      </main>
    </>
  );
}
