"use client";

import { VerseProfileWizard } from "@verse/sdk/profile";
import { useRouter } from "next/navigation";

export default function CreateProfilePage() {
  const router = useRouter();

  return (
    <div className="min-h-[100dvh] px-4 sm:px-6 lg:px-8 py-16">
      <VerseProfileWizard
        dapp="hirecore"
        onChainWrite={async () => new Promise((r) => setTimeout(r, 600))}
        onComplete={() => router.push("/tasks")}
        extensions={[{
          id: "hirecore",
          title: "HireCore Setup",
          fields: [
            { name: "role", label: "Role", type: "select", options: ["Worker", "Client"], required: true },
            { name: "skills", label: "Skills / Interests", type: "tags", placeholder: "Electrician, Plumber, ..." }
          ]
        }]}
      />
    </div>
  );
}
