import { SignIn, useClerk } from "@clerk/nextjs";
import { type NextPage } from "next";

const Page: NextPage = () => {
  const { user } = useClerk();

  if (!user) {
    return (
      <div>
        <SignIn />
      </div>
    );
  }

  const id = user.id;

  return (
    <div>
      <h1>Finances</h1>
    </div>
  );
};

export default Page;
