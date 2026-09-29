"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, ArrowLeft, KeySquare, ShieldAlert } from "lucide-react";
import { cn } from "@verse/ui";

import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import NeonButton from "@verse/arena-web/components/ui/NeonButton";
import { InputField } from "@verse/arena-web/components/ui/InputField";
import { api } from "@verse/arena-web/lib/api";

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<"request" | "reset">("request");
  
  // Request State
  const [username, setUsername] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState("");

  // Reset State
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setRequestLoading(true);
    setRequestError("");
    try {
      await api.post("/v1/gateway/auth/forgot-password", {
        username,
      });
      setStep("reset");
    } catch (error: any) {
      setRequestError(
        error.response?.data?.message || "Failed to process recovery request"
      );
    } finally {
      setRequestLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim() || newPassword.length < 6) return;

    setResetLoading(true);
    setResetError("");
    try {
      await api.post("/v1/gateway/auth/reset-password", {
        username,
        token,
        newPassword,
      });
      setResetSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      setResetError(
        error.response?.data?.message || "Invalid or expired recovery code"
      );
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <EnergyBackground className="flex flex-col h-dvh">
      {/* Top Nav */}
      <nav className="flex items-center justify-between p-6 shrink-0 relative z-10">
        <button
          onClick={() => (step === "reset" ? setStep("request") : router.push("/login"))}
          className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all active:scale-95"
        >
          <ArrowLeft size={16} />
        </button>
      </nav>

      {/* Main Form Area */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:max-w-md sm:mx-auto w-full pb-20">
        <div className="mb-10 animate-in slide-in-from-bottom-4 fade-in duration-700">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center mb-6 shadow-[0_0_30px_hsl(var(--primary)/0.2)]">
            <KeySquare size={28} className="text-primary" />
          </div>
          <h1 className="font-display text-4xl font-black text-white uppercase tracking-tighter leading-[0.9]">
            {step === "request" ? "Recover\nAccess" : "Reset\nPassword"}
          </h1>
          <p className="font-sans text-[13px] text-white/50 mt-4 leading-relaxed">
            {step === "request"
              ? "Enter your tactical ID or registered email to request a clearance reset."
              : "If the ID exists, a clearance code has been sent to the registered email. Enter it below to establish a new encrypted password."}
          </p>
        </div>

        {step === "request" && (
          <form
            onSubmit={handleRequest}
            className="space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-150 fill-mode-both"
          >
            <InputField
              label="Tactical ID / Email"
              type="text"
              placeholder="Fighter name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={requestLoading}
            />

            {requestError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <p>{requestError}</p>
              </div>
            )}

            <div className="pt-4">
              <NeonButton
                type="submit"
                variant="primary"
                disabled={!username.trim() || requestLoading}
                className="w-full h-14"
              >
                {requestLoading ? (
                  <Loader2 size={18} className="animate-spin opacity-50" />
                ) : (
                  "Request Override"
                )}
              </NeonButton>
            </div>
          </form>
        )}

        {step === "reset" && (
          <form
            onSubmit={handleReset}
            className="space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-700"
          >

            <InputField
              label="Clearance Code"
              type="text"
              placeholder="6-digit code"
              value={token}
              onChange={(e) => setToken(e.target.value.toUpperCase())}
              disabled={resetLoading || resetSuccess}
            />
            <InputField
              label="New Password"
              type="password"
              placeholder="Minimum 6 chars"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={resetLoading || resetSuccess}
            />

            {resetError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <p>{resetError}</p>
              </div>
            )}

            {resetSuccess && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-start gap-3">
                <ShieldCheck size={16} className="shrink-0 mt-0.5" />
                <p>Password updated. Returning to login...</p>
              </div>
            )}

            <div className="pt-4">
              <NeonButton
                type="submit"
                variant="primary"
                disabled={!token.trim() || newPassword.length < 6 || resetLoading || resetSuccess}
                className="w-full h-14"
              >
                {resetLoading ? (
                  <Loader2 size={18} className="animate-spin opacity-50" />
                ) : (
                  "Confirm Reset"
                )}
              </NeonButton>
            </div>
          </form>
        )}
      </div>

      {/* Footer Branding */}
      <div className="p-8 mt-auto flex flex-col items-center gap-3 opacity-30 shrink-0">
        <ShieldCheck size={20} />
        <p className="text-[7px] font-mono text-white tracking-[0.4em] uppercase text-center">
          Encrypted_Connection_Active // DeskMate_v1.0
        </p>
      </div>
    </EnergyBackground>
  );
}
