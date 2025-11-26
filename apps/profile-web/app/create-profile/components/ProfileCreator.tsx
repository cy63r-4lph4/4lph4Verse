"use client";

import { useState } from "react";
import ProfileForm from "./ProfileForm";
import ProfilePreview from "./ProfilePreview";
import { Button } from "@verse/ui/components/ui/button";

export default function ProfileCreator() {
  const [form, setForm] = useState({
    avatar: "",
    handle: "",
    displayName: "",
    bio: "",
    location: "",
    interests: [],
    links: {
      twitter: "",
      github: "",
      telegram: "",
      website: "",
      farcaster: "",
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT — FORM */}
        <div>
          <ProfileForm form={form} setForm={setForm} />
        </div>

        {/* RIGHT — STICKY PREVIEW */}
        <div className="relative">
          <div className="sticky top-28 space-y-6">
            {/* Preview card itself */}
            <ProfilePreview form={form} />

            {/* Create Profile button placed under preview */}
            <Button
              className="w-full  py-6 text-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition"
              disabled={!form.handle || !form.displayName}
            >
              Create Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
