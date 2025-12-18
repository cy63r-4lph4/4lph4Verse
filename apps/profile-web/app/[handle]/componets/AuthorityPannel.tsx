"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@verse/ui/components/ui/card";
import { Button } from "@verse/ui/components/ui/button";
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  UserCog,
  KeyRound,
  X,
  Sparkles,
} from "lucide-react";
import { VerseProfile } from "@verse/sdk";

interface AuthorityPanelProps {
  profile: VerseProfile;
  isOwner: boolean;
  onSetDelegate?: (delegate: string | null) => Promise<void> | void;
  onVerify?: () => Promise<void> | void;
}

export function AuthorityPanel({
  profile,
  isOwner,
  onSetDelegate,
  onVerify,
}: AuthorityPanelProps) {
  const [delegateInput, setDelegateInput] = useState("");
  const [confirmingRemoval, setConfirmingRemoval] = useState(false);

  const hasDelegate = Boolean(profile.delegate);
  const isVerified = profile.verified === true;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* ================= Verification Status ================= */}
      <Card className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-cyan-400" />
            <div>
              <h2 className="font-semibold">Verification</h2>
              <p className="text-sm text-slate-400">
                Confirms this profile belongs to its claimed owner
              </p>
            </div>
          </div>

          {isVerified ? (
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Verified</span>
            </div>
          ) : isOwner ? (
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 rgba(168,85,247,0)",
                  "0 0 28px rgba(168,85,247,0.65)",
                  "0 0 0 rgba(168,85,247,0)",
                ],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="rounded-xl"
            >
              <Button
                size="sm"
                onClick={onVerify}
                className="
                  relative overflow-hidden
                  bg-gradient-to-r from-purple-600 to-cyan-500
                  hover:from-purple-500 hover:to-cyan-400
                  text-white font-medium
                  shadow-lg
                "
              >
                {/* shimmer sweep */}
                <motion.span
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ mixBlendMode: "overlay" }}
                />

                <KeyRound className="w-4 h-4 mr-1 relative z-10" />
                <span className="relative z-10 flex items-center gap-1">
                  Verify
                  <Sparkles className="w-3 h-3 opacity-80" />
                </span>
              </Button>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Unverified</span>
            </div>
          )}
        </div>
      </Card>

      {/* ================= Delegate Authority ================= */}
      <Card className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex items-center gap-3">
          <UserCog className="w-6 h-6 text-purple-400" />
          <div>
            <h2 className="font-semibold">Delegate Authority</h2>

            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Changes here affect who controls this profile
            </p>

            <p className="text-sm text-slate-400">
              Allow another address to manage this profile
            </p>
          </div>
        </div>

        {hasDelegate ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-black/30 rounded-xl px-4 py-3">
              <div className="text-sm truncate">
                Delegate:{" "}
                <span className="text-cyan-400">{profile.delegate}</span>
              </div>

              {isOwner && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setConfirmingRemoval(true)}
                >
                  Remove
                </Button>
              )}
            </div>

            {confirmingRemoval && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-red-400">
                  This removes all delegate permissions
                </span>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={async () => {
                    await onSetDelegate?.(null);
                    setConfirmingRemoval(false);
                  }}
                >
                  Confirm
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setConfirmingRemoval(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        ) : isOwner ? (
          <div className="flex flex-col md:flex-row gap-3">
            <input
              className="flex-1 bg-black/30 rounded-xl px-4 py-2 text-sm"
              placeholder="0xDelegateAddress"
              value={delegateInput}
              onChange={(e) => setDelegateInput(e.target.value)}
            />

            <Button
              onClick={async () => {
                if (!delegateInput) return;
                await onSetDelegate?.(delegateInput);
                setDelegateInput("");
              }}
            >
              Set Delegate
            </Button>
          </div>
        ) : (
          <p className="text-sm text-slate-400">No delegate assigned</p>
        )}
      </Card>
    </motion.div>
  );
}
