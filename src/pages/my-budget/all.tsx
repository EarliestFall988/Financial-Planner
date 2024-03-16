import {
  EllipsisVerticalIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Header } from "~/components/header";

import * as Dialog from "@radix-ui/react-dialog";
import { useState, type FC, type ReactNode } from "react";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { formatCurrency } from "~/utils/currency";

const NewGroupDialog: FC<{ children: ReactNode }> = ({ children }) => {
  const { mutateAsync } = api.group.create.useMutation({
    onSuccess: () => {
      toast.success("Great! New group created");
    },
    onError: (error) => {
      toast.error("Error: " + error.message);
    },
  });

  const CreateNewGroup = () => {
    const id = toast.loading("Creating New Group");

    void mutateAsync({
      name: nameText,
      amount: Number(amount),
      description: description,
    }).then(() => {
      setNameText("");
      setAmount("");
      setDescription("");
      toast.done(id);
    });
  };

  const [nameText, setNameText] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-black/70 backdrop-blur" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-zinc-900 p-[25px] text-white focus:outline-none">
          <Dialog.Title>
            <h2 className="text-lg font-semibold">New Group</h2>
          </Dialog.Title>
          <Dialog.Description>
            <p className="pb-2 text-sm text-zinc-300">
              Create a new group for your budget
            </p>
          </Dialog.Description>

          <div>
            <p className="pb-1 text-lg text-white">Name</p>
            <input
              type="text"
              value={nameText}
              onChange={(e) => {
                setNameText(e.target.value);
              }}
              placeholder="name of the group"
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
              placeholder="notes about this group"
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
                placeholder="amount limit in this group"
                className="w-full rounded bg-zinc-800 p-2 text-white outline-none transition duration-100"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Dialog.Close asChild>
              <button
                onClick={CreateNewGroup}
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

const NewSplitDialog: FC<{ children: ReactNode; groupId: string }> = ({
  children,
  groupId,
}) => {
  const { mutateAsync } = api.split.create.useMutation({
    onSuccess: () => {
      toast.success("Great! New split created");
    },
    onError: (error) => {
      toast.error("Error: " + error.message);
    },
  });

  const CreateNewSplit = () => {
    const id = toast.loading("Creating New Split");

    void mutateAsync({
      name: nameText,
      amount: Number(amount),
      description: description,
      groupId: groupId,
    }).then(() => {
      setNameText("");
      setAmount("");
      setDescription("");
      toast.done(id);
    });
  };

  const [nameText, setNameText] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-black/70 backdrop-blur" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-zinc-900 p-[25px] text-white focus:outline-none">
          <Dialog.Title>
            <h2 className="text-lg font-semibold">New Split</h2>
          </Dialog.Title>
          <Dialog.Description>
            <p className="pb-2 text-sm text-zinc-300">
              Create a new split in your group
            </p>
          </Dialog.Description>

          <div>
            <p className="pb-1 text-lg text-white">Name</p>
            <input
              type="text"
              value={nameText}
              onChange={(e) => {
                setNameText(e.target.value);
              }}
              placeholder="name of the split"
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
              placeholder="notes about this split"
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
                placeholder="amount limit in the split"
                className="w-full rounded bg-zinc-800 p-2 text-white outline-none transition duration-100"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Dialog.Close asChild>
              <button
                onClick={CreateNewSplit}
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

const AllSplits: NextPage = () => {
  const { back, push } = useRouter();

  const { data, isLoading } = api.group.getAll.useQuery();

  const goBack = () => {
    if (window.history.length > 1) {
      void back();
    } else {
      void push("/finances");
    }
  };

  return (
    <>
      <Head>
        <title>My Budget | Finance Pro</title>
      </Head>
      <main className="min-h-[100vh] bg-zinc-900 text-white">
        <Header title="My Budget" back={goBack} />
        <div className="grid min-h-[90vh] w-full gap-2 p-2 lg:grid-cols-3">
          {!isLoading &&
            data?.map((group) => (
              <div
                key={group.id}
                className="rounded bg-zinc-800 p-2 lg:w-[20vw]"
              >
                <div className="flex items-center justify-between gap-2 border-b border-zinc-700">
                  <div>
                    <p className="text-lg ">{group.name}</p>
                    <p className="text-sm text-zinc-400">{group.description}</p>
                  </div>
                  <div className="flex items-center gap-1 ">
                    <p className="text-lg ">
                      {formatCurrency.format(
                        parseFloat(group.amount.toString()),
                      )}
                    </p>
                    <button className="rounded p-1 hover:bg-zinc-700">
                      <EllipsisVerticalIcon className="h-6 w-6 text-zinc-400" />
                    </button>
                  </div>
                </div>
                <div>
                  {group.Splits.map((split) => (
                    <div
                      key={split.id}
                      className="flex items-center justify-between border-x border-b border-zinc-700 px-1 py-2"
                    >
                      <div className="">
                        <p>{split.name}</p>
                        <p className="text-sm text-zinc-400">{split.description}</p>
                      </div>
                      <p>
                        {formatCurrency.format(
                          parseFloat(split.amount.toString()),
                        )}
                      </p>
                    </div>
                  ))}
                  <NewSplitDialog groupId={group.id}>
                    <button className="flex w-full items-center justify-center gap-2 rounded p-2 transition duration-150 hover:bg-zinc-700">
                      <PlusIcon className="h-5 w-5" />
                      <p>New Budget Split</p>
                    </button>
                  </NewSplitDialog>
                </div>
              </div>
            ))}
          <NewGroupDialog>
            <div className="group flex h-[20vh] scale-95 flex-col items-center justify-center gap-2 rounded p-2 font-semibold transition duration-700 hover:scale-100 hover:border-none hover:bg-blue-700 lg:w-[20vw]">
              <PlusIcon className="h-10 w-10 text-zinc-600 transition duration-200 group-hover:text-blue-200" />
              <p className="text-lg text-transparent group-hover:text-blue-200">
                New Group
              </p>
            </div>
          </NewGroupDialog>
          {/* <div className="w-full self-start rounded bg-green-900 p-2 lg:w-[20vw]">
            test
          </div>
          <div className="self-start rounded bg-green-900 p-2 lg:w-[20vw]">
            test
          </div>
          <div className="self-start  rounded  bg-green-900 p-2 lg:w-[20vw]">
            test
          </div>
          <div className="self-start  rounded  bg-green-900 p-2 lg:w-[20vw]">
            test
          </div>
          <div className="self-start  rounded  bg-green-900 p-2 lg:w-[20vw]">
            test
          </div> */}
        </div>
      </main>
    </>
  );
};

export default AllSplits;
