"use client";

import OwnerView from "./views/OwnerView";
import PublicView from "./views/PublicView";

export default function ProfileRenderer({ profile, isOwner }: any) {
  if (isOwner) {
    return <OwnerView profile={profile} />;
  }

  return <PublicView profile={profile} />;
}
