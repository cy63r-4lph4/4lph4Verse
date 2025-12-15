"use client";

import { type VerseProfile } from "@verse/sdk";
import { OwnerProfileRoot } from "./views/OwnerView";
import PublicView from "./views/PublicView";

export default function ProfileRenderer({
  profile,
  isOwner,
}: {
  profile: VerseProfile;
  isOwner: boolean;
}) {
  if (isOwner) {
    // OwnerProfileRoot expects props spread as VerseProfile, not as 'profile' prop
    return <OwnerProfileRoot {...profile} />;
  }

  // PublicView expects VerseProfile via 'profile' prop, so keep as is
  return <PublicView profile={profile} />;
}
