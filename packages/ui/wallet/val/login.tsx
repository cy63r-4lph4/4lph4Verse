"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * 4lph4Verse — Unified Login UI (Mystic Sci‑Fi)
 *
 * - Visual-first, one-tap login for casual users (VerseWallet integration point)
 * - Power-user inspector that reveals the EIP-712 challenge (optional)
 * - Shows the exact flow: request challenge -> sign -> verify -> session
 * - Replace the placeholder `verseWallet` calls with your real VerseWallet SDK
 *
 * Drop-in single-file demo. Swap `apiUrl` to point at your VAL gateway.
 */

const apiUrl = "/v1"; // change to your VAL endpoint

// ---------------------------
// Replace these with real VerseWallet helpers
// ---------------------------
const verseWallet = {
  // casual: sign a simple message (verseWallet may expose a nicer API)
  async signMessage(message: string) {
    // TODO: call VerseWallet.signMessage or signTypedData
    // For demo we simulate a signature
    await new Promise((r) => setTimeout(r, 700));
    return `0x_simulated_signature_for_${btoa(message).slice(0, 12)}`;
  },
  // power: sign typed data (EIP-712)
  async signTypedData(typedData: any) {
    await new Promise((r) => setTimeout(r, 900));
    return `0x_simulated_typed_sig_${Math.random().toString(16).slice(2, 12)}`;
  },
};

// ---------------------------
// Helper: pretty time
// ---------------------------
function nowISO() {
  return new Date().toISOString();
}

// ---------------------------
// Main component
// ---------------------------
export default function UnifiedLoginUI() {
  const [address, setAddress] = useState<string | null>("0xAbC...123"); // demo prefills
  const [loading, setLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<any | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [powerUser, setPowerUser] = useState(false);
  const [messagePreview, setMessagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    // reset status on mode change
    setStatus(null);
  }, [powerUser]);

  const requestChallenge = async () => {
    setLoading(true);
    setStatus("Requesting challenge from VAL...");
    try {
      const res = await fetch(`${apiUrl}/auth/challenge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      setChallenge(data);
      setMessagePreview(
        data?.message || JSON.stringify(data?.typedData, null, 2)
      );
      setStatus("Challenge received — ready to sign.");
    } catch (err: any) {
      setStatus("Failed to get challenge");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const signChallenge = async () => {
    if (!challenge) return;
    setLoading(true);
    setStatus("Waiting for VerseWallet to sign — one tap…");
    try {
      let sig: string;
      if (powerUser && challenge.typedData) {
        sig = await verseWallet.signTypedData(challenge.typedData);
      } else {
        // casual path: sign human-readable message
        sig = await verseWallet.signMessage(
          challenge.message || JSON.stringify(challenge)
        );
      }
      setSignature(sig);
      setStatus("Signed locally — verifying with VAL...");
    } catch (err: any) {
      setStatus("Signing failed or was cancelled");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyChallenge = async () => {
    if (!challenge || !signature || !address) return;
    setLoading(true);
    setStatus("Sending signature to VAL for verification...");
    try {
      const res = await fetch(`${apiUrl}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          signature,
          message: challenge.message,
          challengeId: challenge.challengeId,
          typedData: challenge.typedData,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data?.error || "Verify failed");
        console.error(data);
        return;
      }
      setSessionToken(data.accessToken || data.token || "demo-session-token");
      setStatus("Authenticated — session established.");
    } catch (err: any) {
      setStatus("Verify request failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setChallenge(null);
    setSignature(null);
    setSessionToken(null);
    setStatus(null);
  };

  // ---- UI ----
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#02031a] via-[#08102a] to-[#05020a] text-white flex items-center justify-center p-6">
      <div className="relative w-full max-w-4xl">
        {/* header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300">
            4lph4Verse — Unified Login
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-xl mx-auto">
            One-tap sign-in for casual users. Full transparency for power users.
            VerseWallet handles the signing — VAL verifies and issues sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Visual ritual card */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-white/3 to-white/5 border border-white/6 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-300">Signed in as</div>
                <div className="font-mono font-semibold mt-1">
                  {address ?? "—"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Verse mode</div>
                <div className="mt-1 inline-flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={powerUser}
                      onChange={(e) => setPowerUser(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer-checked:bg-cyan-500 peer-checked:shadow-[0_0_10px_rgba(34,211,238,0.25)] transition-all" />
                  </label>
                  <div className="text-xs text-slate-300">Power</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="relative w-44 h-44">
                <motion.div
                  animate={{ rotate: [0, 12, 0, -12, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/20 via-purple-400/12 to-pink-300/10 blur-3xl"
                />
                <div className="absolute inset-6 rounded-full bg-gradient-to-br from-[#052738]/80 to-[#1b0b2e]/80 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-tr from-cyan-300 to-purple-400 shadow-lg flex items-center justify-center font-extrabold text-xl">
                    CØRE
                  </div>
                </div>
              </div>

              <div className="w-full">
                <div className="flex gap-3">
                  <button
                    disabled={loading}
                    onClick={requestChallenge}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold shadow hover:scale-[1.01]"
                  >
                    Request Challenge
                  </button>
                  <button
                    disabled={!challenge || loading}
                    onClick={signChallenge}
                    className="w-36 py-3 rounded-xl border border-white/10"
                  >
                    Sign
                  </button>
                </div>

                <div className="flex gap-3 mt-3">
                  <button
                    disabled={!signature || loading}
                    onClick={verifyChallenge}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-pink-400 font-semibold"
                  >
                    Verify
                  </button>
                  <button
                    onClick={reset}
                    className="w-36 py-3 rounded-xl border border-white/10"
                  >
                    Reset
                  </button>
                </div>

                <div className="mt-4 text-xs text-slate-400">
                  Status:{" "}
                  <span className="text-slate-100">
                    {status ?? (sessionToken ? "Authenticated" : "Idle")}
                  </span>
                </div>

                {sessionToken && (
                  <div className="mt-3 text-xs text-green-300 font-mono break-all">
                    Session Token: {sessionToken}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right: Inspector & flow */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-black/20 to-white/2 border border-white/6 backdrop-blur-lg"
          >
            <h3 className="text-sm text-slate-300">Auth Flow Inspector</h3>
            <div className="mt-3 text-xs text-slate-400">
              This panel shows the exact data exchanged between client and VAL.
              Casual users never see this — power users can inspect it.
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <div className="p-3 rounded-xl bg-black/30 border border-white/4 text-xs">
                <div className="text-[10px] text-slate-400">
                  Challenge (server)
                </div>
                <pre className="mt-2 text-[11px] text-slate-200 max-h-40 overflow-auto p-1">
                  {challenge
                    ? JSON.stringify(challenge, null, 2)
                    : "(no challenge)"}
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-black/30 border border-white/4 text-xs">
                <div className="text-[10px] text-slate-400">
                  Message to Sign
                </div>
                <pre className="mt-2 text-[11px] text-slate-200 max-h-40 overflow-auto p-1">
                  {messagePreview ?? "(none)"}
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-black/30 border border-white/4 text-xs">
                <div className="text-[10px] text-slate-400">
                  Signature (wallet)
                </div>
                <pre className="mt-2 text-[11px] text-slate-200 max-h-20 overflow-auto p-1">
                  {signature ?? "(not signed)"}
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-black/30 border border-white/4 text-xs">
                <div className="text-[10px] text-slate-400">Verify Request</div>
                <pre className="mt-2 text-[11px] text-slate-200 max-h-20 overflow-auto p-1">
                  {signature
                    ? JSON.stringify(
                        {
                          address,
                          signature,
                          challengeId: challenge?.challengeId,
                        },
                        null,
                        2
                      )
                    : "(waiting)"}
                </pre>
              </div>

              <div className="mt-3 text-xs text-slate-400">
                Power-user tip: switch to{" "}
                <span className="font-mono">Power</span> mode to see the EIP-712
                typedData and sign with exact typed-data flows.
              </div>
            </div>

            <div className="mt-6 text-xs text-slate-500">
              Design notes: The casual flow signs a simple human message which
              VerseWallet can render as a friendly prompt ("Sign to continue
              into 4lph4Verse"). The power flow uses typedData (EIP-712) for
              cryptographic clarity and auditability.
            </div>
          </motion.div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 text-xs text-slate-500">
          <div>
            Want this wired into your Faucet, LeaseVault or HireCore? I can
            generate the exact hook + SDK module to drop in.
          </div>
        </div>
      </div>

      <style>{`
  .shadow-2xl { box-shadow: 0 30px 60px rgba(2,8,23,0.8); }
`}</style>
    </div>
  );
}
