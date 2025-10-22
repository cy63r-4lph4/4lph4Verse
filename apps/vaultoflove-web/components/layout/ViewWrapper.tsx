"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function ViewWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      key={Math.random()} // ensures re-animation on change
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.98 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-[calc(100vh-5rem)]"
    >
      {children}
    </motion.div>
  );
}
