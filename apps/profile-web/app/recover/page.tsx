"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@verse/ui/components/ui/card";
import { Button } from "@verse/ui/components/ui/button";
import { Input } from "@verse/ui/components/ui/input";
import {
  AlertTriangle,
  ShieldAlert,
  Search,
  Scale,
} from "lucide-react";

export default function RecoveryRootPage() {
  const router = useRouter();
  const [handle, setHandle] = useState("");

  function proceed() {
    if (!handle) return;
    router.push(`/recover/${handle.toLowerCase()}`);
  }

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 space-y-14">
      {/* HEADER */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-2 text-red-500 font-mono tracking-widest text-sm uppercase">
          <span className="w-12 h-px bg-red-500/50" />
          [ SYSTEM OVERRIDE ]
          <span className="w-12 h-px bg-red-500/50" />
        </div>
        <h1 className="text-4xl font-mono font-bold uppercase tracking-widest text-glow text-red-500">
          Profile Recovery
        </h1>
        <p className="text-slate-400 font-mono text-sm leading-relaxed max-w-2xl mx-auto pt-4">
          {`> RECOVERY IS A `}<span className="text-white font-bold">SERIOUS, IRREVERSIBLE ACTION</span>{`. 
          ONLY INITIATE RECOVERY IF YOU ARE THE RIGHTFUL OWNER OF THE VERSE IDENTITY.`}
        </p>
      </div>

      {/* WARNING BLOCK */}
      <div className="p-10 hud-panel bg-red-950/20 border border-red-500/30 box-glow shadow-[0_0_30px_rgba(239,68,68,0.15)] relative max-w-3xl mx-auto">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-500" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-500" />
        
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-red-500 border-b border-red-500/20 pb-4">
            <AlertTriangle size={22} className="animate-pulse" />
            <h2 className="text-lg font-mono uppercase tracking-widest font-bold text-glow text-red-500">Critical Warnings & Consequences</h2>
          </div>

          <ul className="space-y-4 text-xs font-mono text-slate-300">
            <li className="flex gap-4">
              <ShieldAlert className="text-red-500 mt-0.5 shrink-0" size={16} />
              <span>
                Initiating recovery on a profile you do <span className="text-red-400 font-bold">NOT OWN</span> is treated as a hostile network action.
              </span>
            </li>

            <li className="flex gap-4">
              <Scale className="text-yellow-400 mt-0.5 shrink-0" size={16} />
              <span>
                Failed or malicious recovery attempts result in <span className="text-yellow-400 font-bold">AURA REDUCTION</span>, reputation penalties,
                and may permanently flag your wallet.
              </span>
            </li>

            <li className="flex gap-4">
              <ShieldAlert className="text-alpha-magenta mt-0.5 shrink-0" size={16} />
              <span>
                Identity verification is cryptographically recorded and <span className="text-white font-bold">CANNOT BE UNDONE</span> once submitted.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* SEARCH SECTION */}
      <div className="p-10 hud-panel bg-black/60 border border-alpha-magenta/30 box-glow relative max-w-3xl mx-auto">
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-alpha-magenta" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-alpha-magenta" />
        
        <div className="space-y-6">
          <div className="space-y-2 border-b border-alpha-magenta/20 pb-4">
            <h3 className="text-xl font-mono uppercase tracking-widest font-bold text-glow text-alpha-magenta">Target Identification</h3>
            <p className="text-xs font-mono text-slate-400">
              {`> ENTER THE TARGET VERSE HANDLE YOU WISH TO RECOVER`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-alpha-magenta font-mono">{'>'}</span>
              <Input
                placeholder="HANDLE"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="pl-8 h-12 text-sm font-mono uppercase tracking-widest bg-black/40 border-0 border-b border-alpha-magenta/50 rounded-none focus-visible:ring-0 focus-visible:border-alpha-magenta text-white"
                onKeyDown={(e) => e.key === "Enter" && proceed()}
              />
            </div>

            <Button
              size="lg"
              disabled={!handle}
              onClick={proceed}
              className="bg-alpha-magenta/20 border border-alpha-magenta text-alpha-magenta hover:bg-alpha-magenta/40 hover:text-white transition rounded-none font-mono tracking-widest uppercase"
            >
              [ INITIATE UPLINK ]
            </Button>
          </div>
        </div>
      </div>

      {/* FOOTER NOTE */}
      <p className="text-center text-[11px] font-mono tracking-widest uppercase text-slate-500 border-t border-red-500/10 pt-8 max-w-lg mx-auto">
        {`> SYS.WARN: ABUSE OF THE RECOVERY SYSTEM UNDERMINES TRUST AND WILL BE PENALIZED.`}
      </p>
    </div>
  );
}
