"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, AlertCircle, Fingerprint, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@verse/ui";

import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import NeonButton from "@verse/arena-web/components/ui/NeonButton";
import { InputField } from "@verse/arena-web/components/ui/InputField";
import useLogin from "@verse/arena-web/hooks/useLogin";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoggingIn, errorMessage } = useLogin();

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const cleanUsername = username.trim();
    if (!cleanUsername || !password) return;

    try {
      await login({ identity: cleanUsername, password });
    } catch (err) {
    }
  };

  const isFormValid = username.length >= 3 && password.length >= 6;

  return (
    <EnergyBackground className="flex flex-col h-dvh overflow-hidden">

      {/* Top Nav: Tactical Breadcrumb */}
      <div className="px-6 pt-8 flex items-center justify-between z-50">
        <button
          onClick={() => router.push("/")}
          className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-mono tracking-widest uppercase">Gateway</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]" />
          <span className="text-primary font-mono text-[9px] tracking-[0.4em] uppercase">
            Auth_Protocol
          </span>
        </div>
      </div>

      <div className="flex-1 px-6 py-8 flex flex-col items-center justify-center">

        {/* Header HUD */}
        <div className="text-center mb-10 animate-fade-scale-in">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
            <div className="relative p-4 bg-arena-card border border-primary/30 rounded-2xl">
              <Fingerprint size={32} className="text-primary" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-black text-white tracking-[0.2em] uppercase mb-1 text-glow">
            Recall Identity
          </h1>
          <p className="text-muted-foreground text-[9px] uppercase tracking-widest font-mono italic opacity-70">
            Re-establishing neural uplink...
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm space-y-6 animate-slide-up"
        >
          <div className="space-y-4">
            <InputField
              label="Fighter Alias"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="E.G. SHADOWHAWK"
              autoComplete="username"
              className="uppercase"
            />

            <div className="relative group">
              <InputField
                label="Security Key"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-4 bottom-3 text-[8px] font-mono text-primary/40 hover:text-primary uppercase tracking-tighter"
              >
                Forgot?
              </button>
            </div>
          </div>

          {/* Error Message HUD */}
          {errorMessage && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex items-start gap-3 animate-in fade-in zoom-in duration-200">
              <AlertCircle className="text-destructive shrink-0 mt-0.5" size={14} />
              <div className="space-y-1">
                <p className="text-[8px] font-mono font-bold text-destructive tracking-widest uppercase">
                  Uplink_Intercepted
                </p>
                <p className="text-[9px] font-mono text-destructive/80 leading-tight uppercase">
                  {`> ${errorMessage}. Please try again.`}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4 pt-2">
            <NeonButton
              type="submit"
              size="responsive"
              disabled={!isFormValid || isLoggingIn}
              className="w-full group"
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-white" /> VERIFYING_DATA...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  RESUME <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </NeonButton>

            <button
              type="button"
              onClick={() => router.push("/setup")}
              className="w-full py-2 text-[9px] font-mono text-muted-foreground uppercase tracking-[0.3em] hover:text-primary transition-colors"
            >
              New Combatant? <span className="underline decoration-primary/40">Initialize Forge</span>
            </button>
          </div>
        </form>
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