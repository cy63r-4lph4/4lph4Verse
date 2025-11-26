"use client";

import React from "react";
import AvatarCard from "./AvatarCard";
import OwnerProfileActions from "./OwnerProfileActions";
import VisitorProfileActions from "./VisitorProfileActions";
import { motion } from "framer-motion";

export default function ProfileHeader({ handle, isOwner }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="w-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.4)]"
    >
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
        <AvatarCard text={handle} />

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-violet-300">
            @{handle}
          </h1>

          <div className="mt-1 text-slate-300 text-sm">
            Verse ID: <span className="font-medium">#12345</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto">
          {isOwner ? <OwnerProfileActions /> : <VisitorProfileActions />}
        </div>
      </div>
    </motion.div>
  );
}
