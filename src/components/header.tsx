import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import React from "react";

export const Header: React.FC<{ title: string, back: () => void }> = ({ title, back }) => {
  

  return (
    <div className="flex items-center justify-between border-b border-zinc-600 drop-shadow bg-zinc-700 p-2 rounded-b-lg text-white">
      <div className="flex items-center gap-2">
        <button
          onClick={back}
          className="hover rounded-full p-1 px-3 transition duration-200 hover:bg-zinc-600"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
    </div>
  );
};

