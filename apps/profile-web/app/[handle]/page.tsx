"use client";

import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import ProfileRenderer from "./ProfileRenderer";

export default function ProfilePage() {
  const { handle } = useParams() as { handle: string };
  const { address } = useAccount();

  // ❗ TEMP MOCK — until you finish hooking real profile data
  const mockProfile = {
    handle,
    verseId: 123,
    displayName: "Cy63r ~🐉",
    avatar: null,
    bio: "Building the verse from Ghana.",
    location: "Accra, Ghana",
    links: {
      x: "https://x.com",
      github: "",
      telegram: "",
      website: "",
      farcaster: "",
    },
    owner: "0x123",
    verified: false,
  };

  const isOwner = mockProfile.owner?.toLowerCase() === address?.toLowerCase();

  return (
    <ProfileRenderer profile={mockProfile} isOwner={isOwner} />
  );
}
