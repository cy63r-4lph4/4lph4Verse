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
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight text-red-400">
          Profile Recovery
        </h1>
        <p className="max-w-2xl mx-auto text-slate-400 leading-relaxed">
          Recovery is a <span className="text-white font-medium">serious, irreversible action</span>. 
          Only initiate recovery if you are the rightful owner of the Verse identity.
        </p>
      </div>

      {/* WARNING BLOCK */}
      <Card className="p-10 rounded-3xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl shadow-[0_0_60px_rgba(239,68,68,0.25)]">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-red-400">
            <AlertTriangle size={26} />
            <h2 className="text-2xl font-semibold">Warnings & Consequences</h2>
          </div>

          <ul className="space-y-4 text-sm text-slate-300">
            <li className="flex gap-3">
              <ShieldAlert className="text-red-400 mt-1" size={18} />
              <span>
                Initiating recovery on a profile you do <strong>not own</strong> is treated as a hostile action.
              </span>
            </li>

            <li className="flex gap-3">
              <Scale className="text-yellow-400 mt-1" size={18} />
              <span>
                Failed or malicious recovery attempts result in <strong>aura reduction</strong>, reputation penalties,
                and may permanently flag your wallet.
              </span>
            </li>

            <li className="flex gap-3">
              <ShieldAlert className="text-purple-400 mt-1" size={18} />
              <span>
                Identity verification is cryptographically recorded and cannot be undone once submitted.
              </span>
            </li>
          </ul>
        </div>
      </Card>

      {/* SEARCH SECTION */}
      <Card className="p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">Enter Profile Handle</h3>
            <p className="text-sm text-slate-400">
              Type the Verse handle you wish to recover. You will be redirected to the recovery process.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input
                placeholder="e.g. cy63r_4lph4"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="pl-11 h-12 text-lg"
                onKeyDown={(e) => e.key === "Enter" && proceed()}
              />
            </div>

            <Button
              size="lg"
              disabled={!handle}
              onClick={proceed}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Continue to Recovery
            </Button>
          </div>
        </div>
      </Card>

      {/* FOOTER NOTE */}
      <p className="text-center text-xs text-slate-500">
        Abuse of the recovery system undermines trust in the Verse identity network.
      </p>
    </div>
  );
}
