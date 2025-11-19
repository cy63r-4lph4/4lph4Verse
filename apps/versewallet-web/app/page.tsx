"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@verse/ui/components/ui/button";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background text-foreground perspective-1000">
      {/* -------------------------------------------------- */}
      {/* Cosmic Particle Field */}
      {/* -------------------------------------------------- */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 animate-float-slow opacity-[0.35]"
          style={{ backgroundImage: "url('/noise.png')" }}
        />
      </div>

      {/* -------------------------------------------------- */}
      {/* PORTAL CORE */}
      {/* -------------------------------------------------- */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer Dimensional Ring */}
        <div className="absolute w-[900px] h-[900px] rounded-full border border-[var(--verse-secondary)]/15 animate-portal-spin-slow blur-[1px]" />

        {/* Second rotating layer */}
        <div className="absolute w-[750px] h-[750px] rounded-full border border-[var(--verse-accent)]/15 animate-portal-spin-reverse blur-[1px]" />

        {/* Core Pulse */}
        <div className="absolute w-[550px] h-[550px] bg-[var(--verse-primary)]/20 rounded-full blur-[120px] animate-pulse-soft" />

        {/* Inner Quantum Ring */}
        <div className="absolute w-[260px] h-[260px] border-2 border-[var(--verse-accent)]/40 rounded-full animate-portal-ring" />

        {/* Portal Core Sphere */}
        <div className="absolute w-[180px] h-[180px] rounded-full verse-gradient-verse blur-[4px] animate-core-breathe shadow-[0_0_40px_var(--verse-secondary)]" />
      </div>

      {/* -------------------------------------------------- */}
      {/* CAMERA FLOAT ANIMATION */}
      {/* -------------------------------------------------- */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 animate-camera-drift">
        {/* BRAND */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
          <span className="bg-gradient-to-tr from-blue-500 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            VerseWallet
          </span>
        </h1>

        <p className="mt-4 max-w-xl text-lg md:text-xl text-muted-foreground drop-shadow-[0_0_6px_var(--verse-primary)]">
          Step beyond the boundary.
          <br />
          The sovereign portal of the{" "}
          <span className="text-[var(--verse-secondary)] font-semibold">
            4lph4Verse
          </span>
          .
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col md:flex-row gap-4">
          {/* ENTER PORTAL BUTTON */}
          <Link href="/dashboard">
            <Button
              size="lg"
              className="
        group px-7 py-5 text-base font-semibold rounded-xl 
        bg-[var(--verse-primary)] text-black
        hover:bg-[var(--verse-secondary)] transition-all
        shadow-[0_0_20px_var(--verse-primary)/60]
        relative overflow-hidden
      "
            >
              <span className="relative z-10 flex items-center gap-2">
                Enter Portal
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>

              {/* Soft Pulse Glow */}
              <span
                className="absolute inset-0 bg-[radial-gradient(circle,var(--verse-primary),transparent_70%)]
        opacity-20 group-hover:opacity-40 blur-2xl transition-opacity"
              />
            </Button>
          </Link>

          {/* CREATE IDENTITY BUTTON */}
          <Link href="/auth/signup">
            <Button
              variant="outline"
              size="lg"
              className="
        px-7 py-5 text-base font-semibold rounded-xl 
        border-white/15 text-white
        backdrop-blur-sm hover:bg-white/5
        transition-all
      "
            >
              Create Identity
            </Button>
          </Link>
        </div>

        {/* Secondary */}
        <p className="mt-6 text-sm text-muted-foreground">
          Already a citizen?{" "}
          <Link
            href="/auth/login"
            className="text-[var(--verse-secondary)] hover:underline underline-offset-4"
          >
            Restore Access
          </Link>
        </p>
      </div>

      {/* BOTTOM FADE */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black/30 to-transparent"></div>

      {/* -------------------------------------------------- */}
      {/* KEYFRAME ANIMATIONS (INLINE BECAUSE REUSABLE) */}
      {/* -------------------------------------------------- */}
      <style>{`
        @keyframes portalSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes portalSpinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes coreBreathe {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes portalRing {
          0% { transform: scale(0.95) rotate(0deg); opacity: 0.8; }
          50% { transform: scale(1.05) rotate(3deg); opacity: 1; }
          100% { transform: scale(0.95) rotate(0deg); opacity: 0.8; }
        }
        @keyframes floatSlow {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes cameraDrift {
          0% { transform: translate3d(0,0,0) rotateX(0deg); }
          50% { transform: translate3d(0,-8px,4px) rotateX(0.5deg); }
          100% { transform: translate3d(0,0,0) rotateX(0deg); }
        }

        .animate-portal-spin-slow {
          animation: portalSpin 18s linear infinite;
        }
        .animate-portal-spin-reverse {
          animation: portalSpinReverse 26s linear infinite;
        }
        .animate-core-breathe {
          animation: coreBreathe 6s ease-in-out infinite;
        }
        .animate-portal-ring {
          animation: portalRing 4s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: floatSlow 16s ease-in-out infinite;
        }
        .animate-camera-drift {
          animation: cameraDrift 14s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
