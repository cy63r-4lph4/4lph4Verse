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
import {
  APPNAME,
  resolveAvatarUrl,
  SCOPE,
  useProfileById,
  VERIFICATION_ENDPOINt,
  VerseProfile,
} from "@verse/sdk";
import { ModalWrapper } from "@verse/ui/profile/components/ModalWrapper";
import Verify from "@verse/profile-web/components/SelfQRCode";

export default function OwnerView({ profile }: { profile: VerseProfile }) {
  const verified = profile.verified;

  // modal state
  const [openVerify, setOpenVerify] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [verifyError, setVerifyError] = useState(false);
  const [verifyStep, setVerifyStep] = useState<"info" | "verify">("info");
  const {refetch}=useProfileById();

  const endpoint = VERIFICATION_ENDPOINt;
  const appName = APPNAME;
  const scope = SCOPE;
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
                <div className="flex items-center gap-3 text-green-400">
                  <ShieldCheck size={20} />
                  <span className="font-medium">Verified identity</span>
                  <span className="text-xs text-slate-400">
                    Protected by Self.xyz
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-yellow-400">
                  <BadgeCheck size={20} />
                  <span className="font-medium">Unverified identity</span>
                  <span className="text-xs text-slate-400">
                    Verification unlocks recovery & trust
                  </span>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col md:flex-row gap-3">
              <Button className="min-w-[140px]">Edit Profile</Button>

              {!verified && (
                <Button
                  className="min-w-[190px] bg-purple-600 hover:bg-purple-700"
                  onClick={() => setOpenVerify(true)}
                >
                  Secure & Verify Identity
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
      {!verified && (
        <>
          <ModalWrapper
            open={openVerify}
            onClose={() => {
              setOpenVerify(false);
              setVerifyStep("info");
            }}
          >
            <Card className="p-8 rounded-3xl space-y-6 bg-black/40 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-3 text-purple-400">
                <ShieldCheck size={26} />
                <h2 className="text-2xl font-semibold">
                  Verify your Verse identity
                </h2>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed">
                Identity verification strengthens your Verse profile, enables
                secure recovery, and signals trust across the network.
              </p>

              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Enables profile recovery</li>
                <li>• Prevents impersonation</li>
                <li>• Increases reputation weight</li>
              </ul>

              {/* Privacy Notice */}
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300 space-y-1">
                <p className="font-medium text-cyan-400">
                  Privacy-first verification
                </p>
                <p>
                  Your personal information is{" "}
                  <span className="font-semibold">never stored</span>.
                  Verification uses zero-knowledge proofs and cryptographic
                  hashes only.
                </p>
                <p className="text-slate-400">
                  No documents, biometrics, or identity data are saved by Verse.
                </p>
              </div>

              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => setVerifyStep("verify")}
              >
                Continue to verification
              </Button>

              <p className="text-[11px] text-slate-500 text-center">
                You're always in control. You can close this at any time.
              </p>
            </Card>
          </ModalWrapper>
          {verifyStep === "verify" && (
            <ModalWrapper
              open={openVerify}
              onClose={() => {
                setOpenVerify(false);
                setVerifyStep("info");
              }}
            >
              <Card className="p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">
                    Identity verification
                  </h2>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400"
                    onClick={() => setVerifyStep("info")}
                  >
                    Back
                  </Button>
                </div>

                <Verify
                  scope={scope}
                  endpoint={endpoint}
                  appName={appName}
                  userDefinedData="Used only as zero-knowledge recovery"
                  onSuccessAction={() => {
                    setVerifiedSuccess(true);
                    setOpenVerify(false);
                    setVerifyStep("info");
                    refetch();
                  }}
                  onErrorAction={() => {
                    setVerifyError(true);
                  }}
                />

                <p className="text-[11px] text-slate-500 text-center">
                  Zero-knowledge verification • No personal data stored
                </p>
              </Card>
            </ModalWrapper>
          )}
        </>
      )}

      {verifiedSuccess && (
        <ModalWrapper open onClose={() => setVerifiedSuccess(false)}>
          <Card className="p-10 rounded-3xl text-center space-y-4 border border-white/10 bg-white/5 backdrop-blur-xl">
            <ShieldCheck size={48} className="mx-auto text-green-400" />
            <h2 className="text-3xl font-semibold">Identity verified</h2>
            <p className="text-slate-400">
              Your Verse profile is now protected and recoverable.
            </p>

            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setVerifiedSuccess(false)}
            >
              Continue
            </Button>
          </Card>
        </ModalWrapper>
      )}

      {verifyError && (
        <ModalWrapper open onClose={() => setVerifyError(false)}>
          <Card className="p-8 rounded-3xl text-center space-y-4 bg-white/5 border border-white/10">
            <BadgeCheck size={42} className="mx-auto text-yellow-400" />
            <h2 className="text-xl font-semibold">Verification incomplete</h2>
            <p className="text-slate-400 text-sm">
              We couldn't verify your identity this time. You can retry anytime.
            </p>
            <Button variant="outline" onClick={() => setVerifyError(false)}>
              Dismiss
            </Button>
          </Card>
        </ModalWrapper>
      )}
    </>
  );
}
