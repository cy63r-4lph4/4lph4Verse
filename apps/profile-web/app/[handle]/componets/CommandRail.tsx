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
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:w-[72px] md:flex-col md:items-center md:justify-center">
        <div className="flex flex-col gap-4 rounded-full border border-white/10 bg-black/40 p-2 backdrop-blur-xl shadow-[0_0_40px_rgba(80,150,255,0.15)]">
          {COMMANDS.map(({ id, label, icon: Icon, danger }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                className={cn(
                  "relative flex h-12 w-12 items-center justify-center rounded-full transition-all",
                  isActive
                    ? danger
                      ? "bg-red-500/20"
                      : "bg-cyan-500/20"
                    : "hover:bg-white/10"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="rail-active"
                    className={cn(
                      "absolute inset-0 rounded-full",
                      danger
                        ? "shadow-[0_0_20px_rgba(255,80,80,0.6)]"
                        : "shadow-[0_0_20px_rgba(80,200,255,0.6)]"
                    )}
                  />
                )}

                <Icon
                  className={cn(
                    "relative z-10 h-5 w-5",
                    danger
                      ? isActive
                        ? "text-red-400"
                        : "text-red-300"
                      : isActive
                      ? "text-cyan-400"
                      : "text-slate-300"
                  )}
                />

                {/* Tooltip */}
                <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-xs text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Bottom Dock */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center md:hidden">
        <div className="mx-4 mb-4 flex w-full max-w-md items-center justify-between rounded-2xl border border-white/10 bg-black/50 p-2 backdrop-blur-xl shadow-[0_0_30px_rgba(80,150,255,0.15)]">
          {COMMANDS.map(({ id, icon: Icon, danger }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                className={cn(
                  "relative flex h-12 w-12 items-center justify-center rounded-xl transition-all",
                  isActive
                    ? danger
                      ? "bg-red-500/20"
                      : "bg-cyan-500/20"
                    : "hover:bg-white/10"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="dock-active"
                    className={cn(
                      "absolute inset-0 rounded-xl",
                      danger
                        ? "shadow-[0_0_16px_rgba(255,80,80,0.6)]"
                        : "shadow-[0_0_16px_rgba(80,200,255,0.6)]"
                    )}
                  />
                )}
                <Icon
                  className={cn(
                    "relative z-10 h-5 w-5",
                    danger
                      ? isActive
                        ? "text-red-400"
                        : "text-red-300"
                      : isActive
                      ? "text-cyan-400"
                      : "text-slate-300"
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
