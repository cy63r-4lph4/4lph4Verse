"use client";

import { Card } from "@verse/ui/components/ui/card";
import { User, ShieldCheck } from "lucide-react";

export default function PublicView({ profile }: any) {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-32 h-32 rounded-2xl bg-neutral-800 flex items-center justify-center">
          <User size={48} className="text-neutral-500" />
        </div>

        <div className="space-y-2 flex-1">
          <h1 className="text-3xl font-bold">@{profile.handle}</h1>

          {profile.verified && (
            <div className="flex items-center gap-2 text-green-400">
              <ShieldCheck size={20} />
              <span>Verified</span>
            </div>
          )}

          <p className="text-neutral-400">Verse ID: {profile.verseId}</p>
        </div>
      </div>

      <Card className="p-6 bg-neutral-900 border-neutral-800">
        <h2 className="text-xl font-semibold mb-2">Bio</h2>
        <p className="text-neutral-300">{profile.bio}</p>
      </Card>
    </div>
  );
}
