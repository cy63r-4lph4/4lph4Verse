"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WalletSection() {
  return (
    <div className="flex justify-center mt-6">
      <ConnectButton
        showBalance={{ smallScreen: false, largeScreen: true }}
        accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
      />
    </div>
  );
}
