import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Header } from "~/components/header";

import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import { useState, type FC, type ReactNode } from "react";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { formatCurrency } from "~/utils/currency";
import { PulseSpinner } from "~/components/PropagateSpinner";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQueryClient } from "@tanstack/react-query";

const NewGroupDialog: FC<{ children: ReactNode; count: number }> = ({
  children,
  count,
}) => {
  const query = useQueryClient();

  const { mutateAsync } = api.group.create.useMutation({
    onSuccess: () => {
      toast.success("Great! New group created");
      void query.invalidateQueries();
    },
    onError: (error) => {
      toast.error("Error: " + error.message);
    },
  });

  const CreateNewGroup = () => {
    const id = toast.loading("Creating New Group");

    if (amount === "") return toast.error("Amount is required");
    if (nameText === "") return toast.error("Name is required");

    if (parseFloat(amount) <= 0)
      return toast.error("Amount must be greater than 0");

    void mutateAsync({
      name: nameText,
      amount: Number(amount),
      description: description,
      order: count,
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
  const query = useQueryClient();

  const { mutateAsync } = api.split.create.useMutation({
    onSuccess: () => {
      toast.success("Great! New split created");
      void query.invalidateQueries();
    },
    onError: (error) => {
      toast.error("Error: " + error.message);
    },
  });

  const CreateNewSplit = () => {
    const id = toast.loading("Creating New Split");

    if (amount === "") return toast.error("Amount is required");
    if (nameText === "") return toast.error("Name is required");

    if (parseFloat(amount) <= 0)
      return toast.error("Amount must be greater than 0");

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

const GroupMorePopoverButton: React.FC<{
  id: string;
  order: number;
  length: number;
  children: ReactNode;
}> = ({ id, order, children }) => {
  const query = useQueryClient();

  const { mutateAsync } = api.group.delete.useMutation({
    onSuccess: () => {
      toast.success("Great! Group deleted");
      void query.invalidateQueries();
    },
    onError: (error) => {
      toast.error("Error: " + error.message);
    },
  });

  const { mutateAsync: mutateOrderAsync } = api.group.swap.useMutation({
    onSuccess: () => {
      // toast.success("Great! Group order updated");
      void query.invalidateQueries();
    },
    onError: (error) => {
      toast.error("Error: " + error.message);
    },
  });

  const deleteGroup = () => {
    const res = confirm("Are you sure you want to delete this group?");

    if (res) {
      const tid = toast.loading("Deleting Group");
      void mutateAsync({ id }).then(() => {
        toast.done(tid);
      });
    }
  };

  const setOrder = (odr: number) => {
    // const tid = toast.loading("Updating Group Order");
    void mutateOrderAsync({
      id: id,
      order: odr,
    }).then(() => {
      // toast.done(tid);
    });
  };

  // console.log("order", order);
  // console.log("length", length);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade w-[260px] rounded bg-white p-5 shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] "
          sideOffset={2}
        >
          <div className="flex">
            {/* {order > 0 && ( */}
            <button
              onClick={() => setOrder(order - 1)}
              className="flex w-full items-center justify-center gap-2 p-2 transition duration-100 hover:rounded hover:bg-zinc-100"
            >
              <ArrowLeftIcon className="h-5 w-5 text-zinc-900 rotate-90 lg:rotate-0" />
              <p className="text-zinc-900"></p>
            </button>
            {/* )} */}

            {/* {order < length && ( */}
            <button
              onClick={() => setOrder(order + 1)}
              className="flex w-full items-center justify-center gap-2 p-2 transition duration-100 hover:rounded hover:bg-zinc-100"
            >
              <ArrowRightIcon className="h-5 w-5 text-zinc-900 rotate-90 lg:rotate-0" />
            </button>
            {/* )} */}
          </div>
          <div className="p-3"></div>
          <button
            onClick={deleteGroup}
            className="flex w-full items-center justify-center gap-2 p-2 transition duration-100 hover:rounded hover:bg-zinc-100"
          >
            <TrashIcon className="h-5 w-5 text-red-600" />
            <p className="font-semibold text-red-600">Delete</p>
          </button>
          {/* <Popover.Close /> */}
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

const AllSplits: NextPage = () => {
  const { back, push } = useRouter();

  const { data, isLoading } = api.group.getAll.useQuery();

  const [animParent] = useAutoAnimate();

  const goBack = () => {
    if (window.history.length > 1) {
      void back();
    } else {
      void push("/finances");
    }
  };

  const getDataLength = () => {
    console.log(data);

    return data?.length ?? 0;
  };

  return (
    <>
      <Head>
        <title>My Budget | Finance Pro</title>
      </Head>
      <main ref={animParent} className="min-h-[100vh] bg-zinc-900 text-white">
        <Header title="My Budget" back={goBack} />
        {isLoading && (
          <div className="flex min-h-[90vh] items-center justify-center">
            <PulseSpinner />
          </div>
        )}
        {!isLoading && data?.length !== 0 && (
          <div
            ref={animParent}
            className="grid min-h-[90vh] w-full gap-2 p-2 lg:grid-cols-3 2xl:grid-cols-4 "
          >
            {data?.map((group) => (
              <div
                key={group.id}
                className=" hide-scrollbar max-h-[60vh] min-h-[20vh] overflow-auto rounded bg-zinc-800"
              >
                <div className="sticky top-0 flex w-full items-center justify-between gap-2 bg-zinc-800 p-2">
                  <div>
                    <p className="text-lg font-semibold">{group.name}</p>
                    <p className="-translate-y-2 text-sm text-zinc-400">
                      {group.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ">
                    <p className="text-lg ">
                      {formatCurrency.format(
                        parseFloat(group.amount.toString()),
                      )}
                    </p>
                    <GroupMorePopoverButton
                      order={group.order}
                      id={group.id}
                      length={getDataLength()}
                    >
                      <div className="rounded p-1 hover:bg-zinc-700">
                        <EllipsisVerticalIcon className="h-6 w-6 text-zinc-400" />
                      </div>
                    </GroupMorePopoverButton>
                  </div>
                </div>
                {group.Splits.length > 0 && (
                  <div className="m-2 mb-4 border-t border-zinc-700">
                    {group.Splits.map((split) => (
                      <div
                        key={split.id}
                        className="flex items-center justify-between border-x border-b border-zinc-700 px-1 py-2"
                      >
                        <div className="">
                          <p>{split.name}</p>
                          <p className="text-sm text-zinc-400">
                            {split.description}
                          </p>
                        </div>
                        <p>
                          {formatCurrency.format(
                            parseFloat(split.amount.toString()),
                          )}
                        </p>
                      </div>
                    ))}
                    <div className="pt-5"></div>
                    <NewSplitDialog groupId={group.id}>
                      <button className="flex w-full items-center justify-center gap-2 rounded p-2 transition duration-150 hover:bg-zinc-700">
                        <PlusIcon className="h-5 w-5" />
                      </button>
                    </NewSplitDialog>
                  </div>
                )}
                {group.Splits.length === 0 && (
                  <div className="p-2">
                    <NewSplitDialog groupId={group.id}>
                      <button className="flex w-full items-center justify-center gap-2 rounded p-2 transition duration-150 hover:bg-zinc-700">
                        <PlusIcon className="h-5 w-5" />
                        <p>New Budget Split</p>
                      </button>
                    </NewSplitDialog>
                  </div>
                )}
              </div>
            ))}
            <NewGroupDialog count={data?.length ?? 0}>
              <div className="group flex h-[20vh] scale-95 select-none flex-col items-center justify-center gap-2 rounded p-2 font-semibold transition duration-700 hover:scale-100 hover:border-none hover:bg-sky-700 ">
                <PlusIcon className="h-10 w-10 text-zinc-600 transition duration-700 group-hover:text-blue-200" />
                <p className="text-lg text-transparent transition duration-700 group-hover:text-blue-200">
                  New Group
                </p>
              </div>
            </NewGroupDialog>
          </div>
        )}
        {!isLoading && data?.length === 0 && (
          <div className="flex w-full items-center justify-center p-2">
            <NewGroupDialog count={0}>
              <div className="group flex h-[20vh] w-[20vw] scale-95 select-none flex-col items-center justify-center gap-2 rounded p-2 font-semibold transition duration-700 hover:scale-100 hover:border-none hover:bg-sky-700 ">
                <PlusIcon className="h-10 w-10 text-zinc-600 transition duration-700 group-hover:text-blue-200" />
                <p className="text-lg text-transparent transition duration-700 group-hover:text-blue-200">
                  New Group
                </p>
              </div>
            </NewGroupDialog>
          </div>
        )}
      </main>
    </>
  );
};

export default AllSplits;
