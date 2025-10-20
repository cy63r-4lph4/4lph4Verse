"use client";

import { ToastContainer, ToastProvider } from "@verse/vaultoflove-web/components/toast";


export default function VaultToaster({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <ToastContainer />
    </ToastProvider>
  );
}
