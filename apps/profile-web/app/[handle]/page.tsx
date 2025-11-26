"use client";

import ProfileLayout from "./ProfileLayout";
import { usePathname } from "next/navigation";

export default function ProfilePage() {
  const pathname = usePathname();
  const handle = pathname.replace("/", "");

  // TODO: Replace with real ownership check later
  const isOwner = false;

  return <ProfileLayout handle={handle} isOwner={isOwner} />;
}
