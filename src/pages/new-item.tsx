import { type NextPage } from "next";
import Head from "next/head";
import { Header } from "~/components/header";

const NewItemPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>New Item | FinPlan</title>
      </Head>
      <main className="min-h-[100vh] bg-zinc-800">
        <Header title="New Item" />
      </main>
    </>
  );
};

export default NewItemPage;
