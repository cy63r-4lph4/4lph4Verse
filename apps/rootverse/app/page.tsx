"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

/* ------------------------------------------------------------
 * Animated Gradient Hook
 * ------------------------------------------------------------ */
function useGradientCycle(interval = 6000) {
  const gradients = [
    "from-[#0f2027] via-[#203a43] to-[#2c5364]",
    "from-[#1a1a40] via-[#4c1d95] to-[#9333ea]",
    "from-[#0d324d] via-[#7f5a83] to-[#b5838d]",
    "from-[#001510] via-[#00bf8f] to-[#0099f7]",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % gradients.length),
      interval
    );
    return () => clearInterval(timer);
  }, [interval]);

  return gradients[index];
}

/* ------------------------------------------------------------
 * Verse App Data
 * ------------------------------------------------------------ */
const verseApps = [
  {
    name: "HireCore",
    url: "https://hirecore.xyz",
    desc: "Trustless gig marketplace bridging talent and opportunity.",
    emoji: "👷‍♀️",
    status: "LIVE",
  },
  {
    name: "LeaseVault",
    url: "https://leasevault.xyz",
    desc: "Decentralized leasing platform for property and beyond.",
    emoji: "🗝️",
    status: "ALPHA",
  },
  {
    name: "VaultOfLove",
    url: "https://vaultoflove.xyz",
    desc: "NFT storytelling & creator economy with heart.",
    emoji: "💖",
    status: "SOON",
  },
  {
    name: "4lph4 Foundation",
    url: "https://foundation.4lphaverse.xyz",
    desc: "Education, culture, and the genesis of community.",
    emoji: "🫀",
    status: "LIVE",
  },
  {
    name: "VerseQuest",
    url: "https://quest.4lphaverse.xyz",
    desc: "Reflective learn-to-earn missions that shape your mind.",
    emoji: "🔮",
    status: "COMING",
  },
];

/* ------------------------------------------------------------
 * Main Component
 * ------------------------------------------------------------ */
export default function RootVerse() {
  const gradient = useGradientCycle();

  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-gradient-to-br ${gradient} text-white transition-all duration-1000`}
    >
      {/* Animated stars / background */}
      <StarsFX />

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="relative"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="absolute inset-0 blur-xl opacity-60 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
          />
          <div className="relative z-10 grid size-24 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 text-black text-5xl font-extrabold shadow-2xl">
            α
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-10 text-5xl sm:text-7xl font-extrabold bg-gradient-to-r from-cyan-200 via-white to-purple-300 bg-clip-text text-transparent"
        >
          Welcome to the RootVerse
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="mt-6 max-w-2xl text-white/80 text-lg"
        >
          The living nexus of the 4lph4Verse — where worlds converge, ideas
          evolve, and innovation breathes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="#realms"
            className="rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-8 py-3 font-semibold shadow-lg hover:scale-105 transition"
          >
            Explore Realms
          </Link>
          <Link
            href="https://foundation.4lphaverse.xyz"
            target="_blank"
            className="rounded-xl border border-white/20 px-8 py-3 font-semibold text-white/90 hover:bg-white/10 backdrop-blur-sm transition"
          >
            Join Foundation
          </Link>
        </motion.div>
      </section>

      {/* App Showcase */}
      <section id="realms" className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center text-2xl font-semibold mb-10 text-white/90"
        >
          Realms of the 4lph4Verse
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {verseApps.map((app, i) => (
            <motion.a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{app.emoji}</span>
                <span className="text-xs text-cyan-300">{app.status}</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                {app.name}
              </h3>
              <p className="text-sm text-white/70 mt-2 leading-relaxed">
                {app.desc}
              </p>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 blur-2xl" />
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-center text-sm text-white/50">
        © {new Date().getFullYear()} 4lph4Verse — Built for the Future.
      </footer>
    </main>
  );
}

/* ------------------------------------------------------------
 * Floating Star Background (simple)
 * ------------------------------------------------------------ */
function StarsFX() {
  const stars = Array.from({ length: 80 });

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {stars.map((_, i) => (
        <motion.span
          key={i}
          className="absolute w-0.5 h-0.5 bg-white/60 rounded-full"
          initial={{
            opacity: Math.random() * 0.5 + 0.3,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: ["0%", "100%"],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 6,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}
  