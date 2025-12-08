"use client";

import { useEffect, useState } from "react";
import { SelfQRcodeWrapper, SelfAppBuilder } from "@selfxyz/qrcode";
import { useAccount } from "wagmi";

export default function Verify({
  scope,
  appName,
  endpoint,
}: {
  scope: string;
  appName: string;
  endpoint: string;
}) {
  const [selfApp, setSelfApp] = useState<any | null>(null);
  const { address } = useAccount();

  useEffect(() => {
    if (!address) return;
    const app = new SelfAppBuilder({
      version: 2,
      appName,
      scope,
      endpoint,
      logoBase64: "https://i.postimg.cc/mrmVf9hm/self.png",
      userId: address,
      endpointType: "staging_celo",
      userIdType: "hex",
      userDefinedData:
        "Used only as zero-knowledge recovery - never stored in plain text",
      disclosures: {
        minimumAge: 0,
        nationality: true,
        name: true,
        gender: true,
        date_of_birth: true,
        issuing_state: true,
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
