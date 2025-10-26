// apps/verse-core/components/TxErrorCard.tsx
"use client";

import { useEffect, useRef } from "react";

type ErrorTone = "warn" | "error";
type ClassifiedError = {
  title: string;
  note: string;
  tone: ErrorTone;
  msg: string;
};

function isErrorWithMessage(value: unknown): value is { message: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof (value as Record<string, unknown>).message === "string"
  );
}

function classifyErrorMessage(
  raw: unknown,
  expectedChain?: string
): ClassifiedError {
  const msg = isErrorWithMessage(raw)
    ? raw.message
    : typeof raw === "string"
      ? raw
      : String(raw ?? "");

  const l = msg.toLowerCase();

  if (l.includes("user rejected") || l.includes("denied transaction")) {
    return {
      title: "User cancelled",
      note: "You declined the wallet request, so nothing was sent.",
      tone: "warn",
      msg,
    };
  }
  if (l.includes("insufficient funds")) {
    return {
      title: "Insufficient gas",
      note: "You need a little native token to pay gas on this network.",
      tone: "error",
      msg,
    };
  }
  if (l.includes("insufficient allowance")) {
    return {
      title: "Approval needed",
      note: "Approve token spending first or use a permit flow if supported.",
      tone: "error",
      msg,
    };
  }
  if (l.includes("transfer amount exceeds balance")) {
    return {
      title: "Not enough tokens",
      note: "Your balance is lower than the amount you’re trying to send.",
      tone: "error",
      msg,
    };
  }
  if (l.includes("nonce") && l.includes("too low")) {
    return {
      title: "Pending transaction",
      note: "There is already a pending transaction. Wait a moment and retry.",
      tone: "warn",
      msg,
    };
  }
  if (
    l.includes("chain mismatch") ||
    l.includes("wrong network") ||
    l.includes("different chain")
  ) {
    const detail = expectedChain
      ? `Switch to ${expectedChain} in your wallet, then retry.`
      : "Switch to the correct network in your wallet, then retry.";

    return {
      title: "Wrong network",
      note: detail,
      tone: "warn",
      msg,
    };
  }
  if (l.includes("execution reverted") || l.includes("revert")) {
    return {
      title: "Transaction reverted",
      note: "The contract rejected this call. The state may not allow this action right now.",
      tone: "error",
      msg,
    };
  }

  return {
    title: "Something went wrong",
    note: "Try again. If the issue persists, expand for technical details.",
    tone: "error",
    msg,
  };
}

export default function TxErrorCard({
  error,
  expectedChain,
  onRetry,
}: {
  error: unknown;
  expectedChain?: string;
  onRetry?: () => void;
}) {
  const info = classifyErrorMessage(error, expectedChain);
  const ref = useRef<HTMLDivElement>(null);

  const toneStyles =
    info.tone === "warn"
      ? "border-amber-300/40 bg-amber-500/10 text-amber-100"
      : "border-red-400/40 bg-red-500/10 text-red-100";

  const badge =
    info.tone === "warn"
      ? "bg-amber-500/20 text-amber-100 border border-amber-300/30"
      : "bg-red-500/20 text-red-100 border border-red-300/30";

  const badgeLabel = info.tone === "warn" ? "Heads up" : "Error";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(info.msg);
    } catch {}
  };

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  return (
    <div
      ref={ref}
      className={`rounded-xl p-4 border ${toneStyles} shadow-inner space-y-3`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div
          className={`px-2 py-0.5 rounded-md text-xs font-semibold ${badge}`}
        >
          {badgeLabel}
        </div>
        <div className="flex-1">
          <div className="font-semibold">{info.title}</div>
          <div className="text-sm opacity-90">{info.note}</div>
        </div>
      </div>

      <details className="group">
        <summary className="cursor-pointer text-xs opacity-80 hover:opacity-100">
          Show technical details
        </summary>
        <pre className="mt-2 max-h-40 overflow-auto rounded-md bg-black/40 p-3 text-[11px] leading-relaxed">
          {info.msg}
        </pre>
        <div className="mt-2 flex gap-2">
          <button
            onClick={copy}
            className="text-xs rounded-md border border-white/10 bg-white/5 px-2 py-1 hover:bg-white/10"
          >
            Copy
          </button>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-xs rounded-md border border-white/10 bg-white/5 px-2 py-1 hover:bg-white/10"
            >
              Retry
            </button>
          )}
        </div>
      </details>
    </div>
  );
}
