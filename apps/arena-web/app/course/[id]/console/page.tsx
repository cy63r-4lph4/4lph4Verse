// app/course/[id]/console/page.tsx
"use client";

import { useParams } from "next/navigation";
import useAuth from "@verse/arena-web/hooks/useAuth";
import { useForgePending } from "@verse/arena-web/hooks/useForgeSubmissions";
import { InstructorToolsPanel } from "@verse/arena-web/components/ui/InstructorToolsPanel";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";

export default function InstructorConsolePage() {
  const params = useParams<{ id: string }>();
  const { user, isLoading } = useAuth();
  const canManage = !!user && (user.role === "instructor" || user.role === "admin");
  const { data: pendingForge = [] } = useForgePending(params.id, canManage);

  if (isLoading) return null;

  if (!canManage) {
    return (
      <EnergyBackground className="grid place-items-center px-6" variant="duel">
        <p className="font-display text-white/40 uppercase tracking-[.3em] text-sm text-center">
          Instructor access required
        </p>
      </EnergyBackground>
    );
  }

  return (
    <div className="py-6">
      <InstructorToolsPanel courseId={params.id} pendingForgeCount={pendingForge.length} />
    </div>
  );
}