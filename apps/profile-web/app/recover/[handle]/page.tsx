"use client";

import { Card } from "@verse/ui/components/ui/card";
import { Button } from "@verse/ui/components/ui/button";
import {
  Shield,
  Wallet,
  User,
  BadgeCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { ModalWrapper } from "@verse/ui/profile/components/ModalWrapper";
import Verify from "@verse/profile-web/components/SelfQRCode";
import {
  APPNAME,
  SCOPE,
  VERIFICATION_ENDPOINt,
  VerseProfile,
  resolveAvatarUrl,
  useProfileById,
} from "@verse/sdk";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";

export default function RecoverProfilePage() {
    const { handle } = useParams() as { handle: string };
    const { address } = useAccount();
    const { profile, isLoading, error } = useProfileById(handle);
    const [openVerify, setOpenVerify] = useState(false);

  const avatarUrl = profile.avatar
    ? resolveAvatarUrl(profile.avatar)
    : null;

  return (
    <>
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 space-y-10">
        {/* HEADER */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Recover Profile
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Regain control of this Verse identity using secure recovery
            methods. Choose the option that best fits your situation.
          </p>
        </div>

        {/* PROFILE CARD */}
        <Card className="p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_50px_rgba(80,150,255,0.18)]">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* AVATAR */}
            <div className="w-28 h-28 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={44} className="text-neutral-600" />
              )}
            </div>

            {/* PROFILE INFO */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <h2 className="text-3xl font-semibold">
                @{profile.handle}
              </h2>

              <div className="flex items-center justify-center md:justify-start gap-2 text-cyan-400 text-sm">
                <BadgeCheck size={16} />
                Verse Identity
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2 text-neutral-400 text-sm pt-2">
                <Wallet size={14} />
                <span className="font-mono">
                  {profile.owner.slice(0, 6)}…
                  {profile.owner.slice(-4)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* RECOVERY OPTIONS */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* SELF.XYZ */}
          <Card className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:shadow-[0_0_40px_rgba(168,85,247,0.25)] transition">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-purple-400">
                <Shield size={22} />
                <h3 className="text-xl font-semibold">
                  Recover with Self.xyz
                </h3>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed">
                Verify your real-world identity and securely reclaim
                ownership of this profile. Recommended for most users.
              </p>

              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => setOpenVerify(true)}
              >
                Recover via Identity Verification
              </Button>
            </div>
          </Card>

          {/* GUARDIAN RECOVERY */}
          <Card className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:shadow-[0_0_40px_rgba(80,150,255,0.25)] transition">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-cyan-400">
                <Users size={22} />
                <h3 className="text-xl font-semibold">
                  Guardian Recovery
                </h3>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed">
                Recover access through previously assigned guardians.
                Best used if identity verification is unavailable.
              </p>

              <Button
                variant="outline"
                className="w-full border-cyan-400/40 hover:bg-cyan-400/10"
              >
                Initiate Guardian Recovery
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* SELF VERIFY MODAL */}
      <ModalWrapper open={openVerify} onClose={() => setOpenVerify(false)}>
        <Verify
          scope={SCOPE}
          endpoint={VERIFICATION_ENDPOINt}
          appName={APPNAME}
        />
      </ModalWrapper>
    </>
  );
}
