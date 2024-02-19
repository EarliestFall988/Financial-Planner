import { type NextPage } from "next";

export const ErrorPage: NextPage = () => {
  return (
    <>
      <h1>400 - Not Found</h1>
      <p>Sorry, could not find what you were looking for. Please try again later.</p>
    </>
  );
};

export default ErrorPage;
