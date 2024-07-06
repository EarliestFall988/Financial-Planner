import { type NextPage } from "next";
import Head from "next/head";
import { Header } from "~/components/header";
import { api } from "~/utils/api";
import { PropagateSpinner } from "~/components/PropagateSpinner";
import {
  type FC,
  type ReactNode,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import {
  CalendarDaysIcon,
  CameraIcon,
  CloudArrowUpIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { UploadButton } from "~/utils/uploadthing";
import * as Dialog from "@radix-ui/react-dialog";
import Webcam from "react-webcam";

const RecurringOptionsDialog: FC<{ children: ReactNode }> = ({ children }) => {
  const [interval, setInterval] = useState<string>("weekly");

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-zinc-900 p-[25px] text-white focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title>
            <h2 className="text-lg font-semibold">Recurring Payment</h2>
          </Dialog.Title>
          <Dialog.Description>
            <p className="pb-2 text-sm text-zinc-300">
              Select the frequency of the payment
            </p>
          </Dialog.Description>

          <div className="pt-4">
            <select
              value={interval}
              onChange={(e) => {
                setInterval(e.currentTarget.value);
              }}
              className="w-full rounded bg-zinc-800 p-2 text-white outline-none transition duration-100 hover:ring hover:ring-blue-500 focus:ring-1"
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {interval === "monthly" && (
            <div className="py-4">
              <div className="flex items-center gap-2">
                <p>on the</p>
                <input
                  type="number"
                  className="w-20 rounded bg-zinc-800 p-2 text-white outline-none transition duration-100 hover:ring hover:ring-blue-500 focus:ring-1"
                />
                <p>of the month</p>
              </div>
            </div>
          )}

          {interval !== "monthly" && (
            <div className="py-2">
              <div className="flex items-center gap-2">
                <p>on</p>
                <select
                  // value={interval}
                  // onChange={(e) => {
                  //   setInterval(e.currentTarget.value);
                  // }}
                  className="w-50 rounded bg-zinc-800 p-2 text-white outline-none transition duration-100 hover:ring hover:ring-blue-500 focus:ring-1"
                >
                  <option value="weekly">Monday</option>
                  <option value="biweekly">Tuesday</option>
                  <option value="monthly">Wednesday</option>
                  <option value="monthly">Thursday</option>
                  <option value="monthly">Friday</option>
                  <option value="monthly">Saturday</option>
                </select>
              </div>
            </div>
          )}

          <div className="py-4">
            <p>Starting</p>
            <input
              type="date"
              className="w-full rounded bg-zinc-800 p-2 text-white outline-none transition duration-100 hover:ring hover:ring-blue-500 focus:ring-1"
            />
          </div>

          <button className="rounded bg-blue-700 p-2">
            Stop Recurring Payment
          </button>

          <div className="mt-4 flex justify-end gap-2">
            <Dialog.Close asChild>
              <button
                // onClick={CreateNewGroup}
                className="rounded bg-blue-800 p-2 text-white hover:bg-blue-700"
              >
                Create
              </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button className="rounded bg-zinc-700 p-2 text-white hover:bg-red-700">
                Cancel
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
        <Dialog.Close asChild>
          <button
            className="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full hover:bg-red-700 focus:shadow-[0_0_0_2px] focus:outline-none"
            aria-label="Close"
          >
            <PlusIcon className="rotate-45 text-white" />
          </button>
        </Dialog.Close>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

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
      fileKeys,
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
              <p className="pb-1 text-lg text-white">Recurring</p>
              <div className="flex w-full items-center gap-2 text-white">
                <RecurringOptionsDialog>
                  <button className="rounded bg-zinc-700 p-2 text-white outline-none transition duration-100 hover:ring hover:ring-blue-500 focus:ring-1">
                    <CalendarDaysIcon className="h-6 w-6" />
                  </button>
                </RecurringOptionsDialog>
                <p className="text-zinc-300"></p>
              </div>
            </div>

            <div>
              <p className="pb-1 text-lg text-white">Add Pictures</p>
              <CameraComponent />
            </div>

            <div>
              <p className="pb-1 text-lg text-white">Add Documents</p>

              <div className="flex flex-col gap-2">
                {fileData ? (
                  fileData.map((f, i) => {
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded bg-zinc-800 p-2"
                      >
                        <a
                          href={f.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2"
                        >
                          <p className="border-b text-lg text-white">
                            {f.name}
                          </p>
                        </a>
                        <button
                          onClick={() => {
                            setFileKeys((prev) => {
                              return prev.filter((_, idx) => idx !== i);
                            });
                          }}
                          className="rounded p-1 text-red-500"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div>
                    <PropagateSpinner />
                  </div>
                )}
              </div>

              <div className="pt-6">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    // Do something with the response
                    console.log("Files: ", res);

                    setFileKeys([...fileKeys, ...res.map((f) => f.key)]);

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
                className="w-full rounded bg-gradient-to-r from-slate-700 to-green-700 p-1 outline-none transition duration-200 hover:ring hover:ring-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {isLoading ? (
                  <PropagateSpinner />
                ) : (
                  <div className="flex items-center justify-center gap-2 p-2 text-white">
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

const CameraComponent = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const capture = useCallback(() => {
    if (webcamRef !== null) {
      const imgSrc = webcamRef.current?.getScreenshot();
      console.log(imgSrc);
    }
  }, [webcamRef]);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="flex w-full items-center justify-center gap-2 rounded bg-zinc-800 p-2 text-white transition duration-200 hover:ring hover:ring-blue-500 focus:ring-1 focus:ring-blue-500">
          <CameraIcon className="h-8" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-[50%] top-[50%]  w-[90vw] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-zinc-900 p-[25px] text-white focus:outline-none data-[state=open]:animate-contentShow lg:max-h-[90vh] lg:max-w-[90vw]">
          <Dialog.Title>
            <h2 className="text-lg font-semibold">Take Picture</h2>
            <Dialog.Description className="font-sm text-zinc-400">
              Take pictures of receipts or other supporting documents of your
              purchase
            </Dialog.Description>

            <div className="flex h-full w-full items-center justify-center gap-2 py-5">
              <div>
                <Webcam
                  audio={false}
                  height={720}
                  screenshotFormat="image/jpeg"
                  width={1280}
                  className="rounded-lg border border-blue-600 "
                  ref={webcamRef}
                />
                <button
                  onClick={capture}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded bg-zinc-800 p-2"
                >
                  <CameraIcon className="h-8" />
                  <p>Capture</p>
                </button>
                <Dialog.Close className="w-full">
                  <button className="mt-4 flex w-full items-center justify-center gap-2 rounded bg-red-800 p-2">
                    <XMarkIcon className="h-8" />
                    <p>Cancel</p>
                  </button>
                </Dialog.Close>
              </div>
            </div>
          </Dialog.Title>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default NewItemPage;
