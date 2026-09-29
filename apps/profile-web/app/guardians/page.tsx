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
          className="w-full max-w-3xl hud-panel box-glow border border-alpha-cyan/30 bg-black/60 p-12 text-center relative"
        >
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-alpha-cyan" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-alpha-cyan" />

          <h1 className="text-4xl sm:text-5xl font-mono font-bold uppercase tracking-widest text-glow text-alpha-cyan mb-2">
            Guardian Registry
          </h1>
          <div className="h-px w-24 bg-alpha-cyan/50 mx-auto mb-6" />

          <p className="text-slate-400 font-mono text-sm max-w-2xl mx-auto leading-relaxed">
            {`> THE GUARDIAN REGISTRY IS A VERIFIED DIRECTORY OF TRUSTED ENTITIES IN THE 4LPH4VERSE. DISCOVER AND APPOINT GUARDIANS TO ASSIST WITH ACCOUNT RECOVERY AND IDENTITY PROTECTION.`}
          </p>

          {/* Coming soon box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-10 p-8 border border-alpha-cyan/30 bg-black/60 relative"
          >
            {/* Corner decals */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-alpha-cyan/50" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-alpha-cyan/50" />
            
            <p className="text-lg text-alpha-cyan font-mono font-bold uppercase tracking-widest text-glow flex items-center justify-center gap-3">
              <span className="w-2 h-2 bg-alpha-cyan animate-pulse" />
              DATABANK LOCKED
            </p>
            <p className="text-sm mt-2 font-mono text-slate-400 tracking-wider">
              {`> THE GUARDIAN REGISTRY IS CURRENTLY OFFLINE. AWAITING DATA SYNC.`}
            </p>

            <button
              disabled
              className="mt-6 px-8 py-3 text-xs font-mono uppercase tracking-widest text-alpha-cyan/50 border border-alpha-cyan/20 bg-alpha-cyan/5 cursor-not-allowed"
            >
              [ BROWSE GUARDIANS ]
            </button>
          </motion.div>

          {/* Extra explanation */}
          <div className="mt-10 text-slate-400 font-mono text-xs leading-relaxed max-w-xl mx-auto border-t border-alpha-cyan/20 pt-6">
            <p>
              {`> ONCE LIVE, YOU WILL BE ABLE TO BROWSE GUARDIANS, VIEW DETAILS, TRUST SCORES, AND CLICK`} <span className="text-alpha-cyan">“ADD GUARDIAN”</span> {`TO ASSIGN THEM TO YOUR PROFILE.`}
            </p>
            <p className="mt-2 text-alpha-magenta/80">
              {`> SYS.NOTE: YOU WILL STILL BE ABLE TO MANUALLY ASSIGN ANY WALLET ADDRESS AS A GUARDIAN FROM YOUR PROFILE PAGE.`}
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
