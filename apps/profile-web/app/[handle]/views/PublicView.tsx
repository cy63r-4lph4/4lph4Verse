"use client";

import { resolveAvatarUrl } from "@verse/sdk";
import { Card } from "@verse/ui/components/ui/card";
import {
  User,
  ShieldCheck,
  Twitter,
  Github,
  Send,
  Globe,
  Network,
  MapPin,
  Star,
} from "lucide-react";

export default function PublicView({ profile }: any) {
  const socialIcons: any = {
    x: <Twitter className="w-5 h-5 text-cyan-400" />,
    github: <Github className="w-5 h-5 text-cyan-400" />,
    telegram: <Send className="w-5 h-5 text-cyan-400" />,
    website: <Globe className="w-5 h-5 text-cyan-400" />,
    farcaster: <Network className="w-5 h-5 text-cyan-400" />,
  };
  function renderAvatar(profile: any) {
    const avatarUrl = resolveAvatarUrl(profile.avatar) as string;
    return (
      <img src={avatarUrl} className="w-full h-full object-cover rounded-2xl" />
    );
  }
  return (
    <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 space-y-8">
      {/* TOP SECTION */}
      <div className="p-10 hud-panel border-b border-alpha-cyan/30 box-glow bg-black/40 relative">
        <div className="flex flex-col md:flex-row md:items-center gap-10">
          {/* AVATAR */}
          <div className="relative w-32 h-32 bg-black/40 border border-alpha-cyan/30 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            {profile.avatar ? (
              renderAvatar(profile)
            ) : (
              <User size={48} className="text-alpha-cyan/50" />
            )}
          </div>
          {/* MAIN INFO */}
          <div className="space-y-3 flex-1">
            <h1 className="text-display font-mono font-bold text-glow text-alpha-cyan tracking-tight">
              {profile.displayName || `@${profile.handle}`}
            </h1>

            <p className="text-alpha-cyan text-xl font-mono tracking-widest uppercase">
              <span className="opacity-50">@</span>{profile.handle}
            </p>

            {profile.verified && (
              <div className="flex items-center gap-2 text-alpha-cyan font-mono text-sm uppercase tracking-widest mt-2 drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
                <ShieldCheck size={18} />
                <span>Verified Identity</span>
              </div>
            )}

            <p className="text-slate-400 font-mono text-xs tracking-wider mt-2">
              [ VERSE_ID :: {profile.verseId} ]
            </p>

            {profile.location && (
              <div className="flex items-center gap-2 text-alpha-cyan font-mono text-sm uppercase tracking-widest mt-2">
                <MapPin size={16} />
                [ {profile.location} ]
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* BIO CARD */}
      {profile.bio && (
        <div className="hud-panel p-8 border border-alpha-cyan/20 bg-black/40">
          <h2 className="text-sm font-mono uppercase tracking-widest text-alpha-cyan mb-4 flex items-center gap-2">
            <span className="text-slate-500">{'>>'}</span> SYS.LOG: Bio
          </h2>
          <p className="text-sm text-slate-300 font-mono leading-relaxed">
            {profile.bio}
          </p>
        </div>
      )}

      {/* INTERESTS */}
      {profile.interests?.length > 0 && (
        <div className="hud-panel p-8 border border-alpha-cyan/20 bg-black/40">
          <h2 className="text-sm font-mono uppercase tracking-widest text-alpha-cyan mb-4 flex items-center gap-2">
            <Star className="w-4 h-4" /> [ Interests ]
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((i: string) => (
              <span
                key={i}
                className="text-xs font-mono text-slate-300 bg-alpha-cyan/10 border border-alpha-cyan/30 px-2 py-1"
              >
                {i}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* SOCIAL LINKS */}
      {Object.values(profile.links).some((v) => Boolean(v)) && (
        <div className="hud-panel p-8 border border-alpha-cyan/20 bg-black/40">
          <h2 className="text-sm font-mono uppercase tracking-widest text-alpha-cyan mb-6 flex items-center gap-2">
            <Network className="w-4 h-4" /> [ Linked Transmissions ]
          </h2>

          <div className="flex gap-4 flex-wrap">
            {Object.entries(profile.links).map(([key, value]: any) =>
              value ? (
                <a
                  key={key}
                  href={value.startsWith("http") ? value : `https://${value}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-alpha-cyan/5 border border-alpha-cyan/30 hover:bg-alpha-cyan/20 transition hover:border-alpha-cyan shadow-[0_0_10px_rgba(0,240,255,0)] hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                >
                  {socialIcons[key]}
                </a>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}
