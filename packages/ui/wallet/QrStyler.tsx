"use client";

import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

interface QRStylerProps {
  uri: string;
  size?: number;
  logoUrl?: string;
}

export function QRStyler({ uri, size = 260, logoUrl }: QRStylerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  // Create QR instance once
  useEffect(() => {
    if (!ref.current || qrRef.current) return;

    qrRef.current = new QRCodeStyling({
      type: "canvas",
      width: size,
      height: size,
      margin: 0,
      data: uri,
      qrOptions: {
        errorCorrectionLevel: "H",
      },
      image: logoUrl,
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 0,
        hideBackgroundDots: true,
      },
      dotsOptions: {
        color: "#111827", // almost black (ensures scannability)
        type: "classy",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        color: "#4f46e5",
      },
      cornersDotOptions: {
        type: "dot",
        color: "#4f46e5",
      },
    });

    qrRef.current.append(ref.current);
  }, [size]);

  // Update QR on prop changes
  useEffect(() => {
    if (qrRef.current) {
      qrRef.current.update({ data: uri, image: logoUrl });
    }
  }, [uri, logoUrl, size]);

  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 shadow-[0_0_30px_-6px_rgba(99,102,241,0.7)]">
      <div
        ref={ref}
        style={{ width: size, height: size }}
        className="relative rounded-2xl"
      ></div>

      {/* <div className="absolute inset-0 rounded-2xl border border-indigo-400/40 animate-pulse pointer-events-none" /> */}
    </div>
  );
}
