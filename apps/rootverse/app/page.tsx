"use client";

import { AnimatedBackground } from "@rootverse/components/AnimatedBackground";
import { BackgroundMusic } from "@rootverse/components/BackgroundMusic";
import { EpicOpeningAnimation } from "@rootverse/components/EpicOpeningAnimation";
import { GameLoader } from "@rootverse/components/GameLoader";
import { Navigation } from "@rootverse/components/Navigaton";
import { RealmCard } from "@rootverse/components/RealmCard";
import { useState } from "react";

export default function GenesisGateway() {
  const [showLoader, setShowLoader] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleLoaderComplete = () => setShowLoader(false);
  const handleBeginGenesis = () => setShowAnimation(true);
  const handleAnimationComplete = () => setShowAnimation(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#030015] via-[#0b0030] to-[#12002f]" />
      <div className="absolute inset-0 bg-[url('/nebula_bg.jpeg')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-pink-500/10" />

      {!showLoader && !showAnimation && <Navigation />}

      {!showLoader && !showAnimation && (
        <main className="relative z-10 pt-24 text-center">
          <AnimatedBackground />
          <section className="max-w-6xl mx-auto px-4 py-24">
            <div className="relative">
              <h1 className="text-6xl sm:text-8xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                GENESIS GATEWAY
              </h1>
              <p className="text-xl sm:text-2xl text-cyan-200 mt-4">
                Enter the Living Verse
              </p>
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 blur-3xl opacity-50"></div>
            </div>

            <p className="max-w-3xl mx-auto mt-10 text-lg text-white/70">
              The 4lph4Verse stirs to life. Five Realms await those who dare to
              enter — each a fragment of innovation, purpose, and creation.
            </p>

            <div className="mt-16">
              <button
                onClick={handleBeginGenesis}
                className="relative text-lg px-10 py-5 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 border-2 border-cyan-400 shadow-2xl hover:scale-105 transition-all duration-300"
              >
                BEGIN GENESIS
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 blur-xl opacity-75"></div>
              </button>
            </div>
          </section>

          <section className="py-24 bg-black/30 backdrop-blur-md border-t border-white/10">
            <h2 className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-12">
              The Realms of Creation
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
              <RealmCard
                name="HireCore"
                emoji="👷‍♀️"
                color="cyan"
                desc="Trustless gigs and tasks powered by the Verse."
              />
              <RealmCard
                name="LeaseVault"
                emoji="🗝️"
                color="amber"
                desc="Programmable property, on-chain."
              />
              <RealmCard
                name="VaultOfLove"
                emoji="💖"
                color="pink"
                desc="NFT storytelling and tipping."
              />
              <RealmCard
                name="Foundation"
                emoji="🫀"
                color="purple"
                desc="Education, community, genesis of believers."
              />
              <RealmCard
                name="VerseCore"
                emoji="💧"
                color="blue"
                desc="Faucet, dev playground, and Verse SDKs."
              />
              <RealmCard
                name="VerseQuest"
                emoji="🔮"
                color="violet"
                desc="Reflection and reward through learning."
              />
            </div>
          </section>
        </main>
      )}

      <footer className="border-t border-cyan-400/20 bg-black/60 backdrop-blur-md text-center text-sm text-white/50 py-8">
        © {new Date().getFullYear()} 4lph4Verse — Genesis Gateway.
      </footer>

      {showLoader && <GameLoader onComplete={handleLoaderComplete} />}
      {showAnimation && (
        <EpicOpeningAnimation onComplete={handleAnimationComplete} />
      )}
      <BackgroundMusic enabled={!showLoader && !showAnimation} />
    </div>
  );
}
