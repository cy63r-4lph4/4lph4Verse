"use client";

import React from "react";
import { motion } from "framer-motion";

export default function GuardiansPage() {
  return (
    <>
      {/* PAGE CONTENT */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center shadow-[0_0_35px_rgba(0,0,0,0.35)]"
        >
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-violet-300">
            Guardian Registry
          </h1>

          <p className="mt-4 text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The Guardian Registry is a verified directory of trusted people in
            the 4lph4Verse. Here, users can discover and appoint guardians who
            can assist with account recovery and identity protection.
          </p>

          {/* Coming soon box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-10 p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg"
          >
            <p className="text-lg text-slate-200 font-medium">
              🔒 The Guardian Registry is not available yet.
            </p>
            <p className="text-sm mt-1 text-slate-400">
              It will launch soon with verified guardian profiles.
            </p>

            <button
              disabled
              className="mt-5 px-6 py-3 rounded-xl text-sm font-semibold bg-white/10 text-white border border-white/20 cursor-not-allowed opacity-50"
            >
              Browse Guardians (Coming Soon)
            </button>
          </motion.div>

          {/* Extra explanation */}
          <div className="mt-10 text-slate-300 text-sm leading-relaxed">
            <p>
              Once live, you will be able to browse guardians, view details,
              trust scores, and click{" "}
              <span className="text-cyan-300 font-medium">“Add Guardian”</span>{" "}
              to assign them to your VerseProfile.
            </p>
            <p className="mt-2">
              You will also still be able to manually assign any wallet address
              as a guardian from your profile page.
            </p>
          </div>
        </motion.div>
      </div>

      {/* watermark */}
      <div className="absolute bottom-6 left-6 text-xs text-slate-400 opacity-50 z-20">
        Forged in the 4lph4Verse • Guardian Layer by Self.xyz
      </div>
    </>
  );
}
