"use client";
import { useState } from "react";
import { toast } from "sonner";

export default function ClaimPanel() {
  const [status, setStatus] = useState<
    "ready" | "loading" | "success" | "error" | "cooldown"
  >("ready");
  const [cooldown, setCooldown] = useState<number>(0);

  async function handleClaim() {
    if (status === "cooldown") return;

    setStatus("loading");
    try {
      // TODO: replace with real relayer call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStatus("success");
      // Simulate cooldown
      setCooldown(24 * 60 * 60);
    } catch  {
      setStatus("error");
      toast.error("Claim failed, try again.");
    }
  }

  return (
    <div className="text-center space-y-3">
      <button
        onClick={handleClaim}
        disabled={status === "loading" || status === "cooldown"}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 text-black font-bold text-lg shadow-lg hover:opacity-90 disabled:opacity-50"
      >
        {status === "loading" ? "Claiming..." : "Claim 20 CØRE"}
      </button>

      {status === "ready" && <p className="text-gray-400">Ready to claim</p>}
      {status === "success" && (
        <p className="text-green-400">✅ 20 CØRE successfully claimed!</p>
      )}
      {status === "error" && (
        <p className="text-red-400">❌ Claim failed, try again.</p>
      )}
      {status === "cooldown" && (
        <p className="text-yellow-400">⏳ Claim again in {cooldown / 3600}h</p>
      )}
    </div>
  );
}
