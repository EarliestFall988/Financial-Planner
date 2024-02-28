import { ArrowLeftIcon, ArrowRightIcon, PlusIcon } from "@heroicons/react/24/solid";
import { type NextPage } from "next";

const SectionPage: NextPage = () => {
  return (
    <div className="min-h-[100vh] bg-zinc-900 text-zinc-100">
      <h1 className="p-2">header section {'(need a back button here)'}</h1>
      <div className="flex gap-2 justify-center items-start p-1">
        <div className="h-[80vh] w-[5vh] p-2 flex items-center justify-center">
          <ArrowLeftIcon className="w-6 h-6" />
        </div>
        <div className="max-h-[90vh] w-full border-zinc-700 border">
            <div className="p-1 flex gap-2 items-center w-full h-[20vh] justify-center bg-zinc-800">
                <p>New Group</p>
                <PlusIcon className="w-6 h-6" />
            </div>
        </div>
        <div className="h-[80vh] w-[5vh] p-2 flex items-center justify-center">
            <ArrowRightIcon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default SectionPage;
