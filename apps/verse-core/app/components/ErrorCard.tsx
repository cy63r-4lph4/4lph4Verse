// apps/verse-core/components/TxErrorCard.tsx
"use client";

type ClassifiedError = {
  title: string;
  note: string;
  tone: "warn" | "error";
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

function classifyErrorMessage(raw: unknown): ClassifiedError {
  const msg = isErrorWithMessage(raw)
    ? raw.message
    : typeof raw === "string"
    ? raw
    : String(raw ?? "");

  const l = msg.toLowerCase();

  if (l.includes("user rejected") || l.includes("denied transaction")) {
    return {
      title: "Transaction cancelled",
      note: "You closed the wallet or declined the signature. No funds were spent.",
      tone: "warn",
      msg,
    };
  }
  if (l.includes("insufficient funds")) {
    return {
      title: "Insufficient funds for gas",
      note: "You need a little native token on this network to pay gas. Top up and try again.",
      tone: "error",
      msg,
    };
  }
  if (l.includes("chain mismatch") || l.includes("wrong network")) {
    return {
      title: "Wrong network",
      note: "You’re connected to a different chain than this faucet expects. Switch network in your wallet, then retry.",
      tone: "warn",
      msg,
    };
  }
  if (l.includes("execution reverted") || l.includes("revert")) {
    return {
      title: "Transaction reverted",
      note: "The contract rejected this call (often due to cooldowns, limits, or invalid state).",
      tone: "error",
      msg,
    };
  }
  return {
    title: "Something went wrong",
    note: "Please try again. If it keeps happening, open details and share the error.",
    tone: "error",
    msg,
  };
}

export default function TxErrorCard({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry?: () => void;
}) {
  const info = classifyErrorMessage(error);

  const toneStyles =
    info.tone === "warn"
      ? "border-amber-300/40 bg-amber-500/10 text-amber-100"
      : "border-red-400/40 bg-red-500/10 text-red-100";

  const badge =
    info.tone === "warn"
      ? "bg-amber-500/20 text-amber-100 border border-amber-300/30"
      : "bg-red-500/20 text-red-100 border border-red-300/30";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(info.msg);
    } catch {
      // no-op
    }
  };

  return (
    <div
      className={`rounded-xl p-4 border ${toneStyles} shadow-inner space-y-3`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div
          className={`px-2 py-0.5 rounded-md text-xs font-semibold ${badge}`}
        >
          Error
        </div>
        <div className="flex-1">
          <div className="font-semibold">{info.title}</div>
          <div className="text-sm/6 opacity-90">{info.note}</div>
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
