import {
  SignInButton,
  SignOutButton,
  UserButton,
  useClerk,
} from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";


export default function Home() {
  const { user } = useClerk();

  return (
    <>
      <Head>
        <title>Landing Page | FinPlan</title>
      </Head>
      <div className="h-[100vh] bg-zinc-800">
        {user && (
          <div className="flex h-10 justify-end p-2">
            <UserButton />
          </div>
        )}
        <div className="flex h-[90vh] w-full items-center justify-center">
          {user ? (
            <div className="flex flex-col gap-2 justify-center items-start">
              <h1 className="text-3xl font-semibold text-white">Hey {user.fullName}!</h1>
              <Link
                href="/finances"
                className="rounded bg-blue-700 p-2 font-semibold text-white"
              >
                View Finances
              </Link>
            </div>
          ) : (
            <div className="bg-blue-500 rounded p-2 text-center text-white font-semibold">
              <SignInButton />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
