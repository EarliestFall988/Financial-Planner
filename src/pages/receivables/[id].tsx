import { type NextPage } from "next";
import Head from "next/head";
import { Header } from "~/components/header";
import { api } from "~/utils/api";
import { PropagateSpinner } from "~/components/PropagateSpinner";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import {
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const NewItemPage: NextPage = () => {
  const { back, query } = useRouter();

  const id = query.id as string;

  const goBack = () => {
    if (window.history.length > 1) {
      void back();
    } else {
      void window.location.replace("/");
    }
  };

  const { data, isLoading, isError } = api.receivable.getSingleReceivable.useQuery({
    id: id,
  });

  const [anim] = useAutoAnimate();

  const { mutate: deletePayable, isLoading: isDeleting } =
    api.receivable.deleteReceivable.useMutation({
      onSuccess: () => {
        toast.success("Payable deleted successfully");
        goBack();
      },
      onError: (error) => {
        toast.error("Error deleting payable: " + error.message);
      },
    });

  const { mutate: saveChanges, isLoading: isSaving } =
    api.receivable.updateReceivable.useMutation({
      onSuccess: () => {
        toast.success("Payable updated successfully");
        goBack();
      },
      onError: (error) => {
        toast.error("Error updating payable: " + error.message);
      },
    });

  const [nameText, setNameText] = useState<string>("");
  const [paymentFrom, setPaymentFrom] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  useMemo(() => {
    if (data) {
      setNameText(data.name);
      setDescription(data.description);
      setAmount(data.amount.toString());
      setPaymentFrom(data.receivedFrom.toString());
    }
  }, [data]);

  const SubmitPayable = () => {
    if (nameText.trim().length < 3) {
      toast.error("Name must be at least 3 characters long");
      return;
    }

    if (isNaN(parseFloat(amount))) {
      toast.error("Amount must be a number");
      return;
    }

    const amountNumber = +amount;

    saveChanges({
      id: id,
      name: nameText,
      amount: amountNumber,
      description: description,
      paymentFrom,
    });
  };

  const DeletePayable = () => {
    if (confirm("Are you sure you want to delete this payable?") === false)
      return;
    deletePayable(id);
  };

  return (
    <>
      <Head>
        <title>New Payable | FinPlan</title>
      </Head>
      <main className="min-h-[100vh] bg-zinc-900">
        <Header title="New Payable" back={goBack} />
        {isError ? (
          <div className="flex h-96 items-center justify-center p-2">
            <div className="flex w-full items-center justify-center gap-2 rounded-full bg-red-800 p-4 text-white md:w-1/2">
              <ExclamationTriangleIcon className="h-10 w-10 rotate-12 " />
              <p className="text-2xl">Error loading payable</p>
            </div>
          </div>
        ) : (
          <div ref={anim} >
            {isLoading ? (
              <div className="min-h-[90vh] flex items-center justify-center">
                <PropagateSpinner />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-5 py-10">
                <div className="flex w-11/12 flex-col gap-6 lg:w-2/3 xl:w-1/2">
                  <div>
                    <p className="pb-1 text-lg text-white">Name</p>
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
                    <p className="pb-1 text-lg text-white">Payment From</p>
                    <input
                      type="text"
                      value={paymentFrom}
                      onChange={(e) => {
                        setPaymentFrom(e.target.value);
                      }}
                      placeholder="name of the transaction"
                      className="w-full rounded bg-zinc-800 p-2 text-white outline-none transition duration-100 hover:ring hover:ring-blue-500 focus:ring-1"
                    />
                  </div>
                  
                  <div>
                    <p className="text-lg text-white">Date Created</p>
                    <div className="flex items-center gap-1 rounded">
                      <p className="w-full rounded px-2 font-semibold text-zinc-300 outline-none transition duration-100">
                      {(data.createdAt.getMonth() + 1) +
                          " / " +
                          data.createdAt.getDate() +
                          " / " +
                          data.createdAt.getFullYear()}
                      </p>
                    </div>
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
                    {!isDeleting && (
                      <button
                        onClick={SubmitPayable}
                        className="w-full rounded bg-blue-800 p-2 outline-none transition duration-200 hover:bg-blue-700 focus:ring-1 focus:ring-blue-500"
                      >
                        {isSaving || isLoading || isDeleting ? (
                          <PropagateSpinner />
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-white">
                            <CloudArrowUpIcon className="h-6 w-6" />
                            <p className="text-lg font-semibold text-white">
                              Save
                            </p>
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {!isSaving && (
                      <>
                        <p className="text-lg text-red-500">Danger Zone</p>
                        <div className="rounded-lg border-2 border-dashed border-red-500 px-2 py-8">
                          <button
                            onClick={DeletePayable}
                            className="w-full rounded bg-red-800 p-1 outline-none transition duration-200 hover:bg-red-700 focus:ring-1 focus:ring-blue-500"
                          >
                            {isSaving || isLoading || isDeleting ? (
                              <PropagateSpinner />
                            ) : (
                              <div className="flex items-center justify-center gap-2 text-white">
                                <TrashIcon className="h-6 w-6" />
                                <p className="text-lg font-semibold text-white">
                                  Delete Receivable
                                </p>
                              </div>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default NewItemPage;
