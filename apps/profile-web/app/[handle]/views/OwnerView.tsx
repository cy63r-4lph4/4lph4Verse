"use client";

import { Card } from "@verse/ui/components/ui/card";
import { Button } from "@verse/ui/components/ui/button";
import { BadgeCheck, ShieldCheck, User } from "lucide-react";

export default function OwnerView({ profile }: any) {
  const verified = profile.verified;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-32 h-32 rounded-2xl bg-neutral-800 flex items-center justify-center">
          <User size={48} className="text-neutral-500" />
        </div>

        <div className="space-y-2 flex-1">
          <h1 className="text-3xl font-bold">@{profile.handle}</h1>
          <p className="text-neutral-400">Verse ID: {profile.verseId}</p>

          {verified ? (
            <div className="flex items-center gap-2 text-green-400">
              <ShieldCheck size={20} />
              <span>Verified with Self.ID</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-yellow-400">
              <BadgeCheck size={20} />
              <span>Not verified</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button>Edit Profile</Button>

          {!verified && (
            <Button className="bg-purple-600 hover:bg-purple-700">
              Verify with Self.ID
            </Button>
          )}
        </div>
      </div>

      {/* Basic info */}
      <Card className="p-6 bg-neutral-900 border-neutral-800">
        <div>
          <h2 className="text-xl font-semibold mb-2">Bio</h2>
          <p className="text-neutral-300">{profile.bio}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium">Location</h3>
          <p className="text-neutral-400">{profile.location}</p>
        </div>
      </Card>
    </div>
  );
}
