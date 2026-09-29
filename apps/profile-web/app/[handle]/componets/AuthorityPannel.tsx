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
      <div className="hud-panel p-6 border border-alpha-cyan/30 bg-black/40 box-glow">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-alpha-cyan" />
            <div>
              <h2 className="font-mono text-sm uppercase tracking-widest text-alpha-cyan">SYS.VERIFICATION</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                {'// Confirms this profile belongs to its claimed owner'}
              </p>
            </div>
          </div>

          {isVerified ? (
            <div className="flex items-center gap-2 text-alpha-cyan drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-mono text-sm uppercase tracking-widest">Verified</span>
            </div>
          ) : isOwner ? (
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 rgba(0,240,255,0)",
                  "0 0 20px rgba(0,240,255,0.4)",
                  "0 0 0 rgba(0,240,255,0)",
                ],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="border border-alpha-cyan/50"
            >
              <Button
                size="sm"
                onClick={onVerify}
                className="
                  relative overflow-hidden rounded-none
                  bg-alpha-cyan/10 hover:bg-alpha-cyan/20
                  text-alpha-cyan shadow-lg font-mono uppercase tracking-widest text-xs
                "
              >
                {/* shimmer sweep */}
                <motion.span
                  className="absolute inset-0 bg-white/10"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ mixBlendMode: "overlay" }}
                />

                <KeyRound className="w-4 h-4 mr-2 relative z-10" />
                <span className="relative z-10 flex items-center gap-1">
                  [ VERIFY ]
                  <Sparkles className="w-3 h-3 opacity-80" />
                </span>
              </Button>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 text-alpha-magenta drop-shadow-[0_0_5px_rgba(255,0,255,0.5)]">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-mono text-sm uppercase tracking-widest">Unverified</span>
            </div>
          )}
        </div>
      </div>

      {/* ================= Delegate Authority ================= */}
      <div className="hud-panel p-6 border border-alpha-magenta/30 bg-alpha-magenta/5 box-glow-magenta space-y-6">
        <div className="flex items-start gap-4">
          <UserCog className="w-8 h-8 text-alpha-magenta drop-shadow-[0_0_5px_rgba(255,0,255,0.5)] mt-1" />
          <div>
            <h2 className="font-mono text-base uppercase tracking-widest text-alpha-magenta">SYS.AUTHORITY :: DELEGATION</h2>
            <p className="text-xs text-alpha-magenta/80 font-mono mt-2 flex items-center gap-2 bg-alpha-magenta/10 border border-alpha-magenta/20 p-2 w-fit">
              <AlertTriangle className="w-4 h-4" />
              WARNING: CHANGES HERE AFFECT WHO CONTROLS THIS PROFILE
            </p>
            <p className="text-sm text-slate-400 font-mono mt-3">
              {'// Allow another address to manage this profile'}
            </p>
          </div>
        </div>

        {hasDelegate ? (
          <div className="space-y-4 pt-4 border-t border-alpha-magenta/20">
            <div className="flex items-center justify-between bg-black/60 border border-alpha-magenta/30 px-4 py-3">
              <div className="text-sm font-mono truncate">
                <span className="text-slate-500 mr-2">DELEGATE:</span>
                <span className="text-alpha-magenta">{profile.delegate}</span>
              </div>

              {isOwner && (
                <Button
                  size="sm"
                  onClick={() => setConfirmingRemoval(true)}
                  className="rounded-none border border-alpha-magenta bg-alpha-magenta/20 hover:bg-alpha-magenta/40 text-alpha-magenta font-mono uppercase tracking-widest text-xs"
                >
                  [ REMOVE ]
                </Button>
              )}
            </div>

            {confirmingRemoval && (
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-red-950/40 border border-red-500/50 p-4">
                <span className="text-sm font-mono text-red-400 uppercase tracking-widest flex-1">
                  ! THIS REMOVES ALL DELEGATE PERMISSIONS !
                </span>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={async () => {
                      await onSetDelegate?.(null);
                      setConfirmingRemoval(false);
                    }}
                    className="rounded-none border border-red-500 bg-red-500/20 hover:bg-red-500/40 text-red-400 font-mono uppercase tracking-widest text-xs"
                  >
                    [ CONFIRM ]
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setConfirmingRemoval(false)}
                    className="rounded-none hover:bg-white/10 text-slate-300 font-mono text-xs"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : isOwner ? (
          <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-alpha-magenta/20">
            <input
              className="flex-1 bg-black/60 border border-alpha-magenta/30 focus:border-alpha-magenta px-4 py-3 text-sm font-mono text-alpha-magenta placeholder:text-alpha-magenta/30 focus:outline-none"
              placeholder="0xDELEGATE_ADDRESS"
              value={delegateInput}
              onChange={(e) => setDelegateInput(e.target.value)}
            />

            <Button
              onClick={async () => {
                if (!delegateInput) return;
                await onSetDelegate?.(delegateInput);
                setDelegateInput("");
              }}
              className="rounded-none border border-alpha-magenta bg-alpha-magenta/20 hover:bg-alpha-magenta/40 text-alpha-magenta font-mono uppercase tracking-widest h-auto"
            >
              [ SET DELEGATE ]
            </Button>
          </div>
        ) : (
          <p className="text-sm font-mono text-slate-400 pt-4 border-t border-alpha-magenta/20">{'// No delegate assigned'}</p>
        )}
      </div>
    </motion.div>
  );
}
