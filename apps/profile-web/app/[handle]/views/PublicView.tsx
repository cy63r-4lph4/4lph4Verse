"use client";

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

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 space-y-12">
      {/* TOP SECTION */}
      <Card className="p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(80,150,255,0.15)]">
        <div className="flex flex-col md:flex-row md:items-center gap-10">
          {" "}
          {/* AVATAR */}
          <div className="w-32 h-32 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center overflow-hidden">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <User size={48} className="text-neutral-600" />
            )}
          </div>
          {/* MAIN INFO */}
          <div className="space-y-3 flex-1">
            <h1 className="text-3xl font-bold">
              {profile.displayName || `@${profile.handle}`}
            </h1>

            <p className="text-cyan-400 text-sm">@{profile.handle}</p>

            {profile.verified && (
              <div className="flex items-center gap-2 text-green-400">
                <ShieldCheck size={20} />
                <span className="font-medium">Verified Identity</span>
              </div>
            )}

            <p className="text-neutral-400 text-sm">
              Verse ID: {profile.verseId}
            </p>

            {profile.location && (
              <div className="flex items-center gap-2 text-neutral-400 text-sm">
                <MapPin size={16} />
                {profile.location}
              </div>
            )}
          </div>
        </div>
      </Card>
      {/* BIO CARD */}
      {profile.bio && (
        <Card className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(80,150,255,0.12)]">
          <h2 className="text-xl font-semibold mb-3">Bio</h2>
          <p className="text-neutral-300 leading-relaxed">{profile.bio}</p>
        </Card>
      )}

      {/* INTERESTS */}
      {profile.interests?.length > 0 && (
        <Card className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <h2 className="text-xl font-semibold mb-4">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((i: string) => (
              <span
                key={i}
                className="px-3 py-1 bg-cyan-500/20 border border-cyan-500 text-cyan-300 rounded-full text-xs flex items-center gap-1"
              >
                <Star size={12} /> {i}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* SOCIAL LINKS */}
      {Object.values(profile.links).some((v) => Boolean(v)) && (
        <Card className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <h2 className="text-xl font-semibold mb-4">Links</h2>

          <div className="flex gap-4 flex-wrap">
            {Object.entries(profile.links).map(([key, value]: any) =>
              value ? (
                <a
                  key={key}
                  href={value.startsWith("http") ? value : `https://${value}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
                >
                  {socialIcons[key]}
                </a>
              ) : null
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
