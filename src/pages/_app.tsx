import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";

import React from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <ToastContainer
      position="bottom-center"
      theme="dark"
      />
      <ClerkProvider>
        <Component {...pageProps} />
      </ClerkProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
