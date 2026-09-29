"use client";

import dynamic from "next/dynamic";

export const ClientWeb3Provider = dynamic(
  () => import("@verse/providers/index").then((m) => m.Web3Provider),
  { ssr: false }
);
