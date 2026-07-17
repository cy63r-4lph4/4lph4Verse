"use client";

import { useParams } from "next/navigation";
import { Flame } from "lucide-react";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import { ForgeAnvil } from "@verse/arena-web/components/ui/forge/ForgeAnvil";
import { SubmissionStatusList } from "@verse/arena-web/components/ui/forge/SubmissionStatusList";
import { useForgeMine, useForgeSubmit } from "@verse/arena-web/hooks/useForgeSubmissions";

export default function ForgePage() {
  const params = useParams<{ id: string }>();
  const courseId = params.id;

  const { data: mine = [], isLoading } = useForgeMine(courseId);
  const submit = useForgeSubmit(courseId);

  const approvedCount = mine.filter((s: any) => s.status === "approved").length;

  return (
    <EnergyBackground className="px-4 py-6" variant="duel">
      <div className="max-w-md mx-auto space-y-6">
        <header className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1">
            <Flame size={11} className="text-orange-400" />
            <span className="font-display text-[9px] font-black text-orange-400 uppercase tracking-[0.25em]">
              {approvedCount} forged into the bank
            </span>
          </div>
          <h1 className="font-display text-2xl font-black text-white uppercase tracking-wide">
            Contribute Knowledge
          </h1>
          <p className="font-display text-[10px] text-white/30 uppercase tracking-wider">
            Submitted questions are reviewed before entering live battles
          </p>
        </header>

        <ForgeAnvil
          onSubmit={(payload) => submit.mutate(payload)}
          isSubmitting={submit.isPending}
        />

        <div className="space-y-3">
          <p className="font-display text-[10px] font-black text-white/40 uppercase tracking-[0.25em] px-1">
            Your Submissions
          </p>
          {isLoading ? (
            <p className="text-center font-display text-[10px] text-white/25 uppercase tracking-widest py-8">
              Loading…
            </p>
          ) : (
            <SubmissionStatusList submissions={mine} />
          )}
        </div>
      </div>
    </EnergyBackground>
  );
}