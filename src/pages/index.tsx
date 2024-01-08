import {
  SignInButton,
  SignOutButton,
  UserButton,
  useClerk,
} from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

export default function Home() {
  const { user } = useClerk();
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

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
            <div>
              <Link href="/finances" className="rounded bg-blue-700 p-3 font-semibold text-white">
                View your Finances
              </Link>
            </div>
          ) : (
            <div>
              <SignInButton />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
