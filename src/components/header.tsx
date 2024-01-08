import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import React from "react";

export const Header: React.FC<{ title: string }> = ({ title }) => {
  const { back } = useRouter();

  const goBack = () => {
    if (window.history.length > 1) {
      void back();
    } else {
      void window.location.replace("/");
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-zinc-600 drop-shadow bg-zinc-700 p-2 text-white">
      <div className="flex items-center gap-2">
        <button
          onClick={goBack}
          className="hover rounded-full p-1 px-3 transition duration-200 hover:bg-zinc-600"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
    </div>
  );
};
