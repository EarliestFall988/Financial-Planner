import { type NextPage } from "next";
import Head from "next/head";
import { Header } from "~/components/header";
import { api } from "~/utils/api";
import { PropagateSpinner } from "~/components/PropagateSpinner";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { CloudArrowUpIcon, TrashIcon } from "@heroicons/react/24/solid";
import { UploadButton } from "~/utils/uploadthing";

const NewItemPage: NextPage = () => {
  const { back } = useRouter();

  const goBack = () => {
    if (window.history.length > 1) {
      void back();
    } else {
      void window.location.replace("/");
    }
  };

  const { mutate, isLoading } = api.payable.createPayable.useMutation({
    onSuccess: () => {
      toast.success("Payable created successfully");
      goBack();
    },
    onError: (error) => {
      toast.error("Error creating payable: " + error.message);
    },
  });

  const { data: splitData } = api.split.getAll.useQuery();

  const [nameText, setNameText] = useState<string>("");
  const [paymentTo, setPaymentTo] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [allocation, setAllocation] = useState<string>("");
  const [fileKeys, setFileKeys] = useState<string[]>([]);


  const { data: fileData } = api.image.findImageWithKeys.useQuery({
    keys: fileKeys,
  });

  useEffect(() => {
    if (paymentDate === "") {
      setPaymentDate(new Date().toISOString().split("T")[0] ?? "");
    }
  }, [paymentDate]);

  const SubmitPayable = () => {
    if (nameText.trim().length < 3) {
      toast.error("Name must be at least 3 characters long");
      return;
    }

    if (isNaN(parseFloat(amount))) {
      toast.error("Amount must be a number");
      return;
    }

    if (allocation === "") {
      toast.error("Please select an Budget");
      return;
    }

    const amountNumber = +amount;

    mutate({
      name: nameText,
      amount: amountNumber,
      description: description,
      paymentTo,
      paymentDate: new Date(paymentDate),
      budgetSplitId: allocation,
      fileKeys
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
              <p className="pb-1 text-lg text-white">Payment To</p>
              <input
                type="text"
                value={paymentTo}
                onChange={(e) => {
                  setPaymentTo(e.target.value);
                }}
                placeholder="who are you paying? Or who is billing you?"
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
              <p className="pb-1 text-lg text-white">Add Documents</p>

              <div className="flex flex-col gap-2">
                {fileData ? fileData.map((f, i) => {
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-zinc-800 p-2 rounded"
                    >

                      <a
                        href={f.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2"
                      >
                        <p className="text-lg text-white border-b">{f.name}</p>
                      </a>
                      <button
                        onClick={() => {
                          setFileKeys((prev) => {
                            return prev.filter((_, idx) => idx !== i);
                          });
                        }}
                        className="p-1 rounded text-red-500"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>

                  );
                }) : (<div>
                  <PropagateSpinner />
                </div>)}
              </div>

              <div className="pt-6">

                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    // Do something with the response
                    console.log("Files: ", res);

                    setFileKeys([...fileKeys, ...res.map(f => f.key)]);

                    toast.success("File uploaded successfully");
                  }}
                  onUploadError={(error: Error) => {
                    // Do something with the error.
                    // alert(`ERROR! ${error.message}`);
                    toast.error("Error uploading file: " + error.message);
                  }}
                />
              </div>
            </div>
            <div>
              <button
                onClick={SubmitPayable}
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
