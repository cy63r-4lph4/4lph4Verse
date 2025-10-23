"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";

export const EpicOpeningAnimation = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        className="absolute w-[40rem] h-[40rem] rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 opacity-20 blur-3xl"
      />
      <h1 className="text-6xl sm:text-8xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
        4lph4Verse Awakens
      </h1>
      <p className="text-cyan-200 mt-6 text-lg sm:text-xl">
        The Genesis Protocol has been initiated.
      </p>
    </motion.div>
  );
};
