"use client";

import { Card } from "@verse/ui/components/ui/card";
import { Button } from "@verse/ui/components/ui/button";
import {
  BadgeCheck,
  ShieldCheck,
  User,
  Twitter,
  Github,
  Send,
  Globe,
  Network,
  MapPin,
  Star,
} from "lucide-react";

export default function OwnerView({ profile }: any) {
  const verified = profile.verified;

  // social icon mapping
  const socialIcons: any = {
    x: <Twitter className="w-5 h-5 text-cyan-400" />,
    github: <Github className="w-5 h-5 text-cyan-400" />,
    telegram: <Send className="w-5 h-5 text-cyan-400" />,
    website: <Globe className="w-5 h-5 text-cyan-400" />,
    farcaster: <Network className="w-5 h-5 text-cyan-400" />,
  };
  console.log(profile.avatar);
  return (
    <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 space-y-12">
      {/* TOP PROFILE CARD */}
      <Card className="p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(80,150,255,0.15)]">
        <div className="flex flex-col md:flex-row md:items-center gap-10">
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

          {/* USER DETAILS */}
          <div className="flex-1 space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">
              {profile.displayName || `@${profile.handle}`}
            </h1>

            <p className="text-cyan-400 text-sm">@{profile.handle}</p>

            <p className="text-slate-400 text-sm">
              Verse ID • {profile.verseId}
            </p>

            {/* VERIFIED STATUS */}
            {verified ? (
              <div className="flex items-center gap-2 text-green-400">
                <ShieldCheck size={20} />
                <span className="font-medium">Verified with Self.ID</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-yellow-400">
                <BadgeCheck size={20} />
                <span className="font-medium">Not verified</span>
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col md:flex-row gap-3">
            <Button className="min-w-[140px]">Edit Profile</Button>

            {!verified && (
              <Button className="min-w-[160px] bg-purple-600 hover:bg-purple-700">
                Verify with Self.ID
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* DETAILS CARD — BIO, LOCATION, INTERESTS, SOCIAL LINKS */}
      <Card className="p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="space-y-10">
          {/* BIO */}
          <section>
            <h2 className="text-xl font-bold mb-2">Bio</h2>
            <p className="text-slate-300 leading-relaxed">{profile.bio}</p>
          </section>

          {/* LOCATION */}
          {profile.location && (
            <section>
              <h2 className="text-xl font-bold mb-2">Location</h2>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={18} />
                {profile.location}
              </div>
            </section>
          )}

          {/* INTERESTS */}
          {profile.interests?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Interests</h2>
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
            </section>
          )}

          {/* SOCIAL LINKS */}
          {Object.values(profile.links).some(
            (v) => typeof v === "string" && v
          ) && (
            <section>
              <h2 className="text-xl font-bold mb-4">Social Links</h2>

              <div className="flex gap-4 flex-wrap">
                {Object.entries(profile.links).map(([key, value]: any) =>
                  value ? (
                    <a
                      key={key}
                      href={
                        value.startsWith("http") ? value : `https://${value}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
                    >
                      {socialIcons[key]}
                    </a>
                  ) : null
                )}
              </div>
            </section>
          )}
        </div>
      </Card>
    </div>
  );
}
