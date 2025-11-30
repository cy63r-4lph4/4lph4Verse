"use client";

import { useState } from "react";
import ProfileForm from "./ProfileForm";
import ProfilePreview from "./ProfilePreview";
import { Button } from "@verse/ui/components/ui/button";
import { useVerseProfileWizard } from "@verse/sdk";

export default function ProfileCreator() {
  const {
    profile,
    updateProfile,
    setAvatarFromFile,
    submitProfile,
    submitting,
    error,
  } = useVerseProfileWizard();
  function handleSubmit() {
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
        <ProfileForm
            form={profile}
            updateProfile={updateProfile}
            setAvatarFromFile={setAvatarFromFile}
          />        </div>

        <div className="relative">
          <div className="sticky top-28 space-y-6">
            <ProfilePreview form={profile} />

            <Button
              className="w-full  py-6 text-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition"
              // disabled={!ready}
              onClick={handleSubmit}
            >
              Create Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
