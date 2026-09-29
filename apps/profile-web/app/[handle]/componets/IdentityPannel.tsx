"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@verse/ui/components/ui/card";
import { Button } from "@verse/ui/components/ui/button";
import {
  User,
  MapPin,
  Star,
  Link as LinkIcon,
  Pencil,
  Save,
  X,
  Shield,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { VerseProfile, resolveAvatarUrl } from "@verse/sdk";

interface IdentityPanelProps {
  profile: VerseProfile;
  onSave?: (updated: Partial<VerseProfile>) => Promise<void> | void;
  onVerify?: () => void;
}

export function IdentityPanel({
  profile,
  onSave,
  onVerify,
}: IdentityPanelProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Partial<VerseProfile>>({});

  const isVerified = profile.verified === true;

  function startEdit() {
    setDraft({
      displayName: profile.displayName,
      bio: profile.bio,
      purpose: profile.purpose,
      location: profile.location,
      interests: profile.interests,
      links: profile.links,
    });
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setDraft({});
  }

  async function saveChanges() {
    if (onSave) await onSave(draft);
    setEditing(false);
  }

  const avatarUrl = profile.avatar
    ? (resolveAvatarUrl(profile.avatar as string) as string)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* ================= Header ================= */}
      <div className="flex flex-col md:flex-row md:items-center gap-8 border-b border-alpha-cyan/20 pb-8">
        <div className="w-28 h-28 bg-black/40 border border-alpha-cyan/30 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-12 h-12 text-alpha-cyan/50" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <h1 className="text-display font-bold font-mono tracking-tight text-glow">
            {editing ? (
              <input
                className="bg-black/40 border border-alpha-cyan/30 focus:border-alpha-cyan px-4 py-2 focus:outline-none w-full"
                value={draft.displayName ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, displayName: e.target.value })
                }
              />
            ) : (
              <span className="flex items-center gap-4">
                {profile.displayName || `@${profile.handle}`}
                {isVerified && (
                  <CheckCircle2 className="w-8 h-8 text-alpha-cyan drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
                )}
              </span>
            )}
          </h1>

          <p className="text-alpha-cyan text-xl font-mono tracking-widest uppercase">
            <span className="opacity-50">@</span>{profile.handle}
          </p>
          <p className="text-xs text-slate-400 font-mono tracking-wider">
            [ VERSE_ID :: {profile.verseId} ]
          </p>
        </div>

        <div className="flex gap-2">
          {!editing ? (
            <Button size="sm" onClick={startEdit} className="rounded-none border border-alpha-cyan/30 bg-alpha-cyan/10 hover:bg-alpha-cyan/20 text-alpha-cyan font-mono uppercase tracking-widest text-xs">
              <Pencil className="w-4 h-4 mr-2" /> [ EDIT ]
            </Button>
          ) : (
            <>
              <Button size="sm" onClick={saveChanges} className="rounded-none border border-alpha-cyan/30 bg-alpha-cyan/10 hover:bg-alpha-cyan/20 text-alpha-cyan font-mono uppercase tracking-widest text-xs">
                <Save className="w-4 h-4 mr-2" /> [ SAVE ]
              </Button>
              <Button size="sm" variant="ghost" onClick={cancelEdit} className="rounded-none hover:bg-white/10 text-slate-300 font-mono text-xs">
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* ================= Verification Strip ================= */}
      <div className="hud-panel p-5 box-glow">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-alpha-cyan" />
            <div>
              <h3 className="font-mono text-sm uppercase tracking-widest text-alpha-cyan">SYS.VERIFY</h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                {'// Protections Active: Ownership Validation'}
              </p>
            </div>
          </div>

          {isVerified ? (
            <div className="flex items-center gap-2 text-alpha-cyan drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-mono uppercase tracking-widest">Verified</span>
            </div>
          ) : (
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 rgba(0,240,255,0)",
                  "0 0 20px rgba(0,240,255,0.4)",
                  "0 0 0 rgba(0,240,255,0)",
                ],
              }}
              transition={{
                duration: 2.2,
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
                  text-alpha-cyan shadow-lg font-mono tracking-widest uppercase text-xs
                "
              >
                {/* shimmer */}
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
                  [ VERIFY IDENTITY ]
                  <Sparkles className="w-3 h-3 opacity-80" />
                </span>
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* ================= Bio ================= */}
      <div className="hud-panel p-6 border border-alpha-cyan/20 bg-black/40">
        <h2 className="text-sm font-mono uppercase tracking-widest text-alpha-cyan mb-4 flex items-center gap-2">
          <span className="text-slate-500">{'>>'}</span> SYS.LOG: Bio
        </h2>
        {editing ? (
          <textarea
            className="w-full bg-black/60 border border-alpha-cyan/30 p-3 text-sm font-mono text-slate-300 focus:border-alpha-cyan focus:outline-none"
            rows={4}
            value={draft.bio ?? ""}
            onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
          />
        ) : (
          <p className="text-sm text-slate-300 font-mono leading-relaxed">
            {profile.bio || "No bio set."}
          </p>
        )}
      </div>

      {/* ================= Meta ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="hud-panel p-6 border border-alpha-cyan/20 bg-black/40 space-y-4">
          <div className="flex items-center gap-2 text-sm text-alpha-cyan font-mono uppercase tracking-widest">
            <MapPin className="w-4 h-4" /> [ Location ]
          </div>
          {editing ? (
            <input
              className="bg-black/60 border border-alpha-cyan/30 px-3 py-2 text-sm font-mono text-slate-300 w-full focus:border-alpha-cyan focus:outline-none"
              value={draft.location ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, location: e.target.value })
              }
            />
          ) : (
            <p className="text-sm font-mono text-slate-300">{profile.location || "—"}</p>
          )}
        </div>

        <div className="hud-panel p-6 border border-alpha-cyan/20 bg-black/40 space-y-4">
          <div className="flex items-center gap-2 text-sm text-alpha-cyan font-mono uppercase tracking-widest">
            <Star className="w-4 h-4" /> [ Interests ]
          </div>
          {editing ? (
            <input
              className="bg-black/60 border border-alpha-cyan/30 px-3 py-2 text-sm font-mono text-slate-300 w-full focus:border-alpha-cyan focus:outline-none"
              value={(draft.interests || []).join(", ")}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  interests: e.target.value.split(",").map((s) => s.trim()),
                })
              }
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.interests?.length ? profile.interests.map((interest, i) => (
                <span key={i} className="text-xs font-mono text-slate-300 bg-alpha-cyan/10 border border-alpha-cyan/30 px-2 py-1">
                  {interest}
                </span>
              )) : <span className="text-sm font-mono text-slate-300">—</span>}
            </div>
          )}
        </div>
      </div>

      {/* ================= Links ================= */}
      <div className="hud-panel p-6 border border-alpha-cyan/20 bg-black/40">
        <h2 className="text-sm font-mono uppercase tracking-widest text-alpha-cyan mb-6 flex items-center gap-2">
          <LinkIcon className="w-4 h-4" /> [ Linked Transmissions ]
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(profile.links).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="text-xs text-slate-500 font-mono uppercase tracking-widest">{`// ${key}`}</label>
              {editing ? (
                <input
                  className="w-full bg-black/60 border border-alpha-cyan/30 px-3 py-2 text-sm font-mono text-slate-300 focus:border-alpha-cyan focus:outline-none"
                  value={(draft.links as any)?.[key] ?? value}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      links: {
                        ...(draft.links || profile.links),
                        [key]: e.target.value,
                      },
                    })
                  }
                />
              ) : (
                <p className="text-sm truncate text-alpha-cyan font-mono hover:text-white transition-colors cursor-pointer">
                  {value || "—"}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
