"use client";

import { cn } from "@verse/ui/components/lib/utils";
import { motion } from "framer-motion";
import {
  Dna,
  Shield,
  HatGlasses,
  Swords,
  Settings,
} from "lucide-react";

export type OwnerPanel =
  | "identity"
  | "authority"
  | "personas"
  | "activity"
  | "settings";

interface CommandRailProps {
  active: OwnerPanel;
  onChange: (panel: OwnerPanel) => void;
}

const COMMANDS: {
  id: OwnerPanel;
  label: string;
  icon: any;
  danger?: boolean;
}[] = [
  { id: "identity", label: "Identity", icon: Dna },
  { id: "authority", label: "Authority", icon: Shield, danger: true },
  { id: "personas", label: "Personas", icon: HatGlasses },
  { id: "activity", label: "Activity", icon: Swords },
  { id: "settings", label: "Settings", icon: Settings },
];

export function CommandRail({ active, onChange }: CommandRailProps) {
  return (
    <>
      {/* Desktop Left Rail */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:w-[88px] md:flex-col md:items-center md:justify-center border-r border-alpha-cyan/20 bg-black/80 backdrop-blur-xl">
        <div className="flex flex-col gap-6 w-full px-2">
          {COMMANDS.map(({ id, label, icon: Icon, danger }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                className={cn(
                  "relative flex h-16 w-full items-center justify-center transition-all group overflow-hidden border",
                  isActive
                    ? danger
                      ? "bg-alpha-magenta/10 border-alpha-magenta box-glow-magenta"
                      : "bg-alpha-cyan/10 border-alpha-cyan box-glow"
                    : "bg-transparent border-transparent hover:border-alpha-cyan/30 hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="rail-active"
                    className={cn(
                      "absolute left-0 top-0 bottom-0 w-1",
                      danger ? "bg-alpha-magenta" : "bg-alpha-cyan"
                    )}
                  />
                )}

                <Icon
                  className={cn(
                    "relative z-10 h-6 w-6 transition-all duration-300",
                    danger
                      ? isActive
                        ? "text-alpha-magenta"
                        : "text-red-400 group-hover:text-alpha-magenta"
                      : isActive
                      ? "text-alpha-cyan"
                      : "text-slate-400 group-hover:text-alpha-cyan"
                  )}
                />

                {/* Tooltip */}
                <span className="pointer-events-none absolute left-full ml-4 whitespace-nowrap bg-black border border-alpha-cyan/50 px-3 py-1 font-mono text-xs uppercase tracking-widest text-alpha-cyan opacity-0 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-opacity group-hover:opacity-100 z-50">
                  [{label}]
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Bottom Dock */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center md:hidden bg-black/80 backdrop-blur-xl border-t border-alpha-cyan/20">
        <div className="flex w-full items-center justify-around p-2">
          {COMMANDS.map(({ id, icon: Icon, danger }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                className={cn(
                  "relative flex h-14 flex-1 items-center justify-center transition-all overflow-hidden border-t-2",
                  isActive
                    ? danger
                      ? "border-alpha-magenta bg-alpha-magenta/10 box-glow-magenta"
                      : "border-alpha-cyan bg-alpha-cyan/10 box-glow"
                    : "border-transparent hover:bg-white/5"
                )}
              >
                <Icon
                  className={cn(
                    "relative z-10 h-6 w-6",
                    danger
                      ? isActive
                        ? "text-alpha-magenta"
                        : "text-red-400"
                      : isActive
                      ? "text-alpha-cyan"
                      : "text-slate-400"
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
