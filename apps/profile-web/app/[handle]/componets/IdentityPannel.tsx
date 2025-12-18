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
      <div className="flex flex-col md:flex-row md:items-center gap-8">
        <div className="w-28 h-28 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-12 h-12 text-neutral-600" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold">
            {editing ? (
              <input
                className="bg-transparent border-b border-white/20 focus:outline-none"
                value={draft.displayName ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, displayName: e.target.value })
                }
              />
            ) : (
              profile.displayName || `@${profile.handle}`
            )}
          </h1>

          <p className="text-cyan-400 text-sm">@{profile.handle}</p>
          <p className="text-xs text-slate-400">
            Verse ID • {profile.verseId}
          </p>
        </div>

        <div className="flex gap-2">
          {!editing ? (
            <Button size="sm" onClick={startEdit}>
              <Pencil className="w-4 h-4 mr-1" /> Edit
            </Button>
          ) : (
            <>
              <Button size="sm" onClick={saveChanges}>
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
              <Button size="sm" variant="ghost" onClick={cancelEdit}>
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* ================= Verification Strip ================= */}
      <Card className="p-5 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-medium">Identity verification</h3>
              <p className="text-xs text-slate-400">
                Protects your profile and proves ownership
              </p>
            </div>
          </div>

          {isVerified ? (
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Verified</span>
            </div>
          ) : (
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 rgba(168,85,247,0)",
                  "0 0 26px rgba(168,85,247,0.6)",
                  "0 0 0 rgba(168,85,247,0)",
                ],
              }}
              transition={{
                duration: 2.2,
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
                  text-white shadow-lg
                "
              >
                {/* shimmer */}
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
                  Verify identity
                  <Sparkles className="w-3 h-3 opacity-80" />
                </span>
              </Button>
            </motion.div>
          )}
        </div>
      </Card>

      {/* ================= Bio ================= */}
      <Card className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <h2 className="text-lg font-semibold mb-3">Bio</h2>
        {editing ? (
          <textarea
            className="w-full bg-black/30 rounded-xl p-3 text-sm"
            value={draft.bio ?? ""}
            onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
          />
        ) : (
          <p className="text-sm text-slate-300">
            {profile.bio || "No bio set."}
          </p>
        )}
      </Card>

      {/* ================= Meta ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <MapPin className="w-4 h-4" /> Location
          </div>
          {editing ? (
            <input
              className="bg-black/30 rounded-lg px-3 py-2 text-sm"
              value={draft.location ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, location: e.target.value })
              }
            />
          ) : (
            <p className="text-sm">{profile.location || "—"}</p>
          )}
        </Card>

        <Card className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Star className="w-4 h-4" /> Interests
          </div>
          {editing ? (
            <input
              className="bg-black/30 rounded-lg px-3 py-2 text-sm"
              value={(draft.interests || []).join(", ")}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  interests: e.target.value.split(",").map((s) => s.trim()),
                })
              }
            />
          ) : (
            <p className="text-sm">
              {profile.interests?.length ? profile.interests.join(", ") : "—"}
            </p>
          )}
        </Card>
      </div>

      {/* ================= Links ================= */}
      <Card className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <LinkIcon className="w-4 h-4" /> Links
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(profile.links).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <label className="text-xs text-slate-400 capitalize">{key}</label>
              {editing ? (
                <input
                  className="w-full bg-black/30 rounded-lg px-3 py-2 text-sm"
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
                <p className="text-sm truncate text-cyan-400">
                  {value || "—"}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
