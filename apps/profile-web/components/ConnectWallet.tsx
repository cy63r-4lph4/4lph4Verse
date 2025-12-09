"use client";

import VerseConnectButton from "@verse/ui/wallet/VerseConnectButton";
import { useRouter } from "next/navigation"; // <-- correct import for app directory
import { useRef } from "react";

export default function ConnectWallet() {
  const router = useRouter();
  const didRedirectRef = useRef(false);

  return (
    <VerseConnectButton
      variant="glass"
      size="md"
      rounded="lg"
      showBalance={false}
      showWizard={false}
      className="shadow-[0_10px_45px_rgba(80,150,255,0.20)] hover:scale-[1.04] active:scale-95 transition"
      onMissingProfile={() => {
        // if (!didRedirectRef.current) {
        //   didRedirectRef.current = true;
        //   router.push("/create-profile");
        // }
      }}
    />
  );
}
