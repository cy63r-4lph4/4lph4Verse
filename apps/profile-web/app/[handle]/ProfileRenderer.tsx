"use client";

import { OwnerProfileRoot } from "./views/OwnerView";
import PublicView from "./views/PublicView";

export default function ProfileRenderer({ profile, isOwner }: any) {
  if (isOwner) {
    return <OwnerProfileRoot />;
  }

  return <PublicView profile={profile} />;
}
