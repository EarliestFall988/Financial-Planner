import { type NextPage } from "next";

export const ErrorPage: NextPage = () => {
  return (
    <>
      <h1>500 - Server-side error occurred</h1>
      <p>Sorry, a server-side error occurred. Please try again later.</p>
    </>
  );
};

export default ErrorPage;
