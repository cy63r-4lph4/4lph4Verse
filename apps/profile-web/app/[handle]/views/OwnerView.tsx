"use client";

import { useState } from "react";
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
import { resolveAvatarUrl } from "@verse/sdk";
import { ModalWrapper } from "@verse/ui/profile/components/ModalWrapper";
import Verify from "@verse/profile-web/components/SelfQRCode";



export default function OwnerView({ profile }: any) {
  const verified = profile.verified;

  // modal state
  const [openVerify, setOpenVerify] = useState(false);
  const endpoint=process.env.NEXT_PUBLIC_SELF_ENDPOINT!;
  const appName=process.env.NEXT_PUBLIC_SELF_APP_NAME || "Self Docs";
  const scope=process.env.NEXT_PUBLIC_SELF_SCOPE || "self-docs";

  // social icon mapping
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
    <>
      {/* MAIN PROFILE VIEW */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 space-y-12">
        <Card className="p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(80,150,255,0.15)]">
          <div className="flex flex-col md:flex-row md:items-center gap-10">
            {/* AVATAR */}
            <div className="w-32 h-32 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center overflow-hidden">
              {profile.avatar ? (
                renderAvatar(profile)
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
                <Button
                  className="min-w-[160px] bg-purple-600 hover:bg-purple-700"
                  onClick={() => setOpenVerify(true)}
                >
                  Verify with Self.ID
                </Button>
              )}
            </div>
          </div>
        </Card>

        {profile.bio && (
        <Card className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(80,150,255,0.12)]">
          <h2 className="text-xl font-semibold mb-3">Bio</h2>
          <p className="text-neutral-300 leading-relaxed">{profile.bio}</p>
        </Card>
      )}
      
      </div>

      {/* 🔮 VERIFY MODAL */}
      <ModalWrapper open={openVerify} onClose={() => setOpenVerify(false)}>
        <Verify scope={scope} endpoint={endpoint} appName={appName} />
      </ModalWrapper>
    </>
  );
}
