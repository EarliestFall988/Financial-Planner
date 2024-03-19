import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import React from "react";

export const Header: React.FC<{ title: string; back: () => void }> = ({
  title,
  back,
}) => {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 p-2 text-white drop-shadow">
      <div className="flex items-center gap-2">
        <button
          onClick={back}
          className="hover group rounded-full p-1 px-3 transition duration-200 hover:bg-sky-800"
        >
          <ArrowLeftIcon className="h-6 w-6 scale-95 text-zinc-300 transition duration-200 group-hover:scale-100 group-hover:text-white" />
        </button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
    </div>
  );
};
