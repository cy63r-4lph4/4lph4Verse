"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import NeonButton from "@verse/arena-web/components/ui/NeonButton";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your identity...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token missing or invalid.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/v1/gateway/verify-email?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully.");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed. Token may be expired.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("An error occurred during verification.");
      }
    };

    verify();
  }, [token]);

  return (
    <>
      <div className="py-8 flex flex-col items-center justify-center space-y-4">
        {status === "loading" && (
          <>
            <Loader2 size={48} className="text-arena-success animate-spin" />
            <p className="text-white/60 font-mono text-sm uppercase tracking-widest animate-pulse">
              {message}
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 size={56} className="text-arena-success animate-in zoom-in duration-500" />
            <div className="space-y-2">
              <p className="text-arena-success font-mono font-bold text-lg uppercase tracking-widest">
                Identity Confirmed
              </p>
              <p className="text-white/60 font-mono text-xs uppercase">
                {message}
              </p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle size={56} className="text-destructive animate-in zoom-in duration-500" />
            <div className="space-y-2">
              <p className="text-destructive font-mono font-bold text-lg uppercase tracking-widest">
                Verification Failed
              </p>
              <p className="text-white/60 font-mono text-xs uppercase">
                {message}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Action Button */}
      {(status === "success" || status === "error") && (
        <NeonButton
          variant={status === "success" ? "success" : "outline"}
          className="w-full py-4 group"
          onClick={() => router.push("/")}
        >
          <span className="flex items-center justify-center gap-2">
            {status === "success" ? "ENTER THE ARENA" : "RETURN TO GATES"}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </NeonButton>
      )}
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-md text-center space-y-6">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-display font-black text-white uppercase tracking-wider">
            Arena_Verification
          </h1>
          <div className="h-[1px] w-1/2 mx-auto bg-gradient-to-r from-transparent via-arena-success to-transparent opacity-50" />
        </div>

        {/* Content */}
        <Suspense fallback={
          <div className="py-8 flex flex-col items-center justify-center space-y-4">
            <Loader2 size={48} className="text-arena-success animate-spin" />
            <p className="text-white/60 font-mono text-sm uppercase tracking-widest animate-pulse">
              Loading...
            </p>
          </div>
        }>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
