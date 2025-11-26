"use client";

import { useState } from "react";
import ProfileForm from "./ProfileForm";
import ProfilePreview from "./ProfilePreview";

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
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left: Form */}
      <ProfileForm form={form} setForm={setForm} />

      {/* Right: Live Preview */}
      <ProfilePreview form={form} />
    </div>
  );
}
