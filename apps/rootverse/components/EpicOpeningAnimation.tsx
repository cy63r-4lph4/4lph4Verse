"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const SCENES = [
  {
    id: "rebellion-1",
    text: "They taught us to obey the ledger of the old world.",
    duration: 2800,
  },
  {
    id: "rebellion-2",
    text: "But value isn’t a vault. It’s a Verse.",
    duration: 3000,
  },
  {
    id: "rebellion-3",
    text: "So we broke the seal. We rewrote the rules.",
    duration: 3000,
  },
  {
    id: "birth-1",
    text: "Identity found its name. Trust became code. Creation became law.",
    duration: 3500,
  },
  {
    id: "birth-2",
    text: "From shards, a CØRE ignited — and the Dragon breathed.",
    duration: 3800,
  },
  {
    id: "future-1",
    text: "This isn’t a platform. It’s a promise.",
    duration: 3200,
  },
  {
    id: "future-2",
    text: "Welcome, Pioneer. Write the next block of our myth.",
    duration: 3500,
  },
];

export const EpicOpeningAnimation = ({
  onComplete,
}: {
  onComplete: () => void;
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < SCENES.length - 1) {
      const timer = setTimeout(
        () => setIndex((i) => i + 1),
        SCENES[index].duration
      );
      return () => clearTimeout(timer);
    } else {
      const end = setTimeout(onComplete, 3000);
      return () => clearTimeout(end);
    }
  }, [index, onComplete]);

  const scene = SCENES[index];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden text-center">
      {/* background gradients pulsing */}
      <motion.div
        key={scene.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.5, 0.3] }}
        transition={{
          duration: scene.duration / 1000,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl"
      />

      {/* text lines */}
      <motion.p
        key={scene.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="text-2xl sm:text-3xl font-light text-white/90 max-w-3xl leading-relaxed"
      >
        {scene.text}
      </motion.p>

      {/* Dragon flare at a specific moment */}
      {scene.id === "birth-2" && (
        <motion.img
          src="/sigil-dragon.webp"
          alt="Dragon Sigil"
          className="absolute w-[280px] opacity-0"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1] }}
          transition={{ duration: 4, ease: "easeInOut" }}
        />
      )}

      {/* Final reveal */}
      {scene.id === "future-2" && (
        <motion.h1
          className="mt-8 text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
        >
          GENESIS GATEWAY
        </motion.h1>
      )}
    </div>
  );
};
