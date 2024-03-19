import { type NextPage } from "next";
import Head from "next/head";
import { Header } from "~/components/header";
import { api } from "~/utils/api";
import { PropagateSpinner } from "~/components/PropagateSpinner";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";

const NewItemPage: NextPage = () => {
  const { back } = useRouter();

  const goBack = () => {
    if (window.history.length > 1) {
      void back();
    } else {
      void window.location.replace("/");
    }
  };

  const { data: splitData } = api.split.getAll.useQuery();

  const { mutate, isLoading } = api.receivable.createReceivable.useMutation({
    onSuccess: () => {
      toast.success("Payable created successfully");
      goBack();
    },
    onError: (error) => {
      toast.error("Error creating payable: " + error.message);
    },
  });

  const [nameText, setNameText] = useState<string>("");
  const [paymentFrom, setPaymentFrom] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [allocation, setAllocation] = useState<string>("");

  useEffect(() => {
    if (paymentDate === "") {
      setPaymentDate(new Date().toISOString().split("T")[0] ?? "");
    }
  }, [paymentDate]);

  const SubmitReceivable = () => {
    if (nameText.trim().length < 3) {
      toast.error("Name must be at least 3 characters long");
      return;
    }

    if (isNaN(parseFloat(amount))) {
      toast.error("Amount must be a number");
      return;
    }
    
    if (allocation === "") {
      toast.error("Please select a Budget");
      return;
    }

    const amountNumber = +amount;

    const date = new Date(paymentDate);

    mutate({
      name: nameText,
      amount: amountNumber,
      description: description,
      paymentFrom,
      paymentDate: date,
      budgetSplitId: allocation,
    });
  };

  return (
    <>
      <Head>
        <title>New Payable | FinPlan</title>
      </Head>
      <main className="min-h-[100vh] bg-zinc-900">
        <Header title="New Payable" back={goBack} />
        <div className="flex flex-col items-center justify-center gap-5 py-10">
          <div className="flex w-11/12 flex-col gap-6 lg:w-2/3 xl:w-1/2">
            <div>
              <p className="pb-1 text-lg text-white">Title</p>
              <input
                type="text"
                value={nameText}
                onChange={(e) => {
                  setNameText(e.target.value);
                }}
                placeholder="name of the transaction"
                className="w-full rounded bg-zinc-800 p-2 text-white outline-none transition duration-100 hover:ring hover:ring-blue-500 focus:ring-1"
              />
            </div>
            <div>
              <p className="pb-1 text-lg text-white">Amount</p>
              <div className="flex  items-center gap-1 rounded bg-zinc-800 pl-1 hover:ring hover:ring-blue-500 focus:ring-1">
                <p className="text-lg text-zinc-400">$</p>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                  placeholder="amount in the transaction"
                  className="w-full rounded bg-zinc-800 p-2 text-white outline-none transition duration-100 "
                />
              </div>
            </div>
            <div>
              <p className="pb-1 text-lg text-white">Budget</p>
              <select
                value={allocation}
                className="w-full rounded bg-zinc-800 p-2 text-white outline-none transition duration-100 hover:ring hover:ring-blue-500 focus:ring-1"
                onChange={(e) => {
                  setAllocation(e.target.value);
                }}
              >
                <option value="">Select an allocation</option>
                {splitData?.map((itm) => {
                  return (
                    <option key={itm.id} value={itm.id}>
                      {itm.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <p className="pb-1 text-lg text-white">Payment From</p>
              <input
                type="text"
                value={paymentFrom}
                onChange={(e) => {
                  setPaymentFrom(e.target.value);
                }}
                placeholder="where is this money coming from?"
                className="w-full rounded bg-zinc-800 p-2 text-white outline-none transition duration-100 hover:ring hover:ring-blue-500 focus:ring-1"
              />
            </div>
            <div>
              <p className="pb-1 text-lg text-white">Date</p>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => {
                  setPaymentDate(e.target.value);
                }}
                placeholder="where is this money coming from?"
                className="w-full rounded bg-zinc-800 p-2 text-white outline-none transition duration-100 hover:ring hover:ring-blue-500 focus:ring-1"
              />
            </div>
            <div>
              <p className="pb-1 text-lg text-white">Description</p>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                placeholder="notes about this transaction"
                className="w-full rounded bg-zinc-800 p-2 text-white outline-none transition duration-100 hover:ring hover:ring-blue-500 focus:ring-1"
              />
            </div>
            <div>
              <button
                onClick={SubmitReceivable}
                className="w-full rounded bg-blue-800 p-1 outline-none transition duration-200 hover:bg-blue-700 focus:ring-1 focus:ring-blue-500"
              >
                {isLoading ? (
                  <PropagateSpinner />
                ) : (
                  <div className="flex items-center justify-center gap-2 text-white">
                    <CloudArrowUpIcon className="h-6 w-6" />
                    <p className="text-lg font-semibold text-white">Save</p>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default NewItemPage;
