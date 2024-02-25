import { UserButton } from "@clerk/nextjs";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import React from "react";

export const Header: React.FC<{ title: string; back?: () => void }> = ({
  title,
  back,
}) => {
  const { back: routerBack } = useRouter();

  const goBack = () => {
    if (window.history.length > 1) {
      void routerBack();
    } else {
      void window.location.replace("/");
    }
  };

  return (
    <div className="flex items-center justify-between rounded-b-lg border-b border-zinc-600 bg-zinc-700 p-2 text-white drop-shadow">
      <div className="flex items-center gap-2">
        <button
          onClick={back ?? goBack}
          className="hover rounded-full p-1 px-3 transition duration-200 hover:bg-zinc-600"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
    </div>
  );
};

export const StickyHeader: React.FC<{
  title: string;
  backButton?: boolean;
  back?: () => void;
}> = ({ title, backButton, back }) => {
  const { back: routerBack } = useRouter();

  const goBack = () => {
    if (window.history.length > 1) {
      void routerBack();
    } else {
      void window.location.replace("/");
    }
  };

  return (
    <div className="fixed top-0 z-10 flex w-full items-center justify-between bg-zinc-900/60 p-2 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        {backButton && (
          <button onClick={back ?? goBack}>
            <ArrowLeftIcon className="h-6 w-6 text-white" />
          </button>
        )}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="flex items-center justify-center gap-4">
        <UserButton />
      </div>
    </div>
  );
};
