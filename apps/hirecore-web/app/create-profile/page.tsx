"use client";

import { VerseProfileWizard } from "@verse/sdk/profile";
import { useRouter } from "next/navigation";

export default function CreateProfilePage() {
  const router = useRouter();

  return (
    <div className="min-h-[100dvh] px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-5xl mx-auto">
        <VerseProfileWizard
          dapp="hirecore"
          // 👇 bypass chain; pretend write succeeded, so you can see the success screen / UX
          onChainWrite={async (profile) => {
            console.log("MOCK WRITE", profile);
            await new Promise((r) => setTimeout(r, 800));
          }}
          onComplete={() => router.push("/tasks")}
          extensions={[
            {
              id: "hirecore",
              title: "HireCore Setup",
              description: "Tell us how you want to use HireCore",
              fields: [
                {
                  name: "role",
                  label: "Role",
                  type: "select",
                  options: ["Worker", "Client"],
                  required: true,
                },
                {
                  name: "skills",
                  label: "Skills / Interests",
                  type: "tags",
                  placeholder: "Electrician, Plumber, ...",
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}
