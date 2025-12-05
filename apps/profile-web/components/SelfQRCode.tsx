"use client";

import { useEffect, useState } from "react";
import { countries, SelfQRcodeWrapper, SelfAppBuilder } from "@selfxyz/qrcode";
import { useAccount } from "wagmi";

export default function Verify() {
  const [selfApp, setSelfApp] = useState<any | null>(null);
  const { address } = useAccount();

  useEffect(() => {
    if (!address) return;

    const app = new SelfAppBuilder({
      version: 2,
      appName: process.env.NEXT_PUBLIC_SELF_APP_NAME || "Self Docs",
      scope: process.env.NEXT_PUBLIC_SELF_SCOPE || "self-docs",
      endpoint: process.env.NEXT_PUBLIC_SELF_ENDPOINT!,
      logoBase64: "https://i.postimg.cc/mrmVf9hm/self.png",
      userId: address,
      endpointType: "staging_celo",
      userIdType: "hex",
      userDefinedData: "Hello from the Docs!!",
      disclosures: {
        minimumAge: 18,
        excludedCountries: [
          countries.CUBA,
          countries.IRAN,
          countries.NORTH_KOREA,
          countries.RUSSIA,
        ],
        nationality: true,
        gender: true,
      },
    }).build();

    setSelfApp(app);
  }, [address]);

  const handleSuccessfulVerification = () => {
    console.log("Verified!");
  };

  if (!address) return <p>No wallet connected.</p>;

  return (
    <div className="p-4 sm:p-6">
      {selfApp ? (
        <SelfQRcodeWrapper
          selfApp={selfApp}
          onSuccess={handleSuccessfulVerification}
          onError={() => console.error("Error: Failed to verify identity")}
        />
      ) : (
        <p>Loading QR Code...</p>
      )}
    </div>
  );
}
