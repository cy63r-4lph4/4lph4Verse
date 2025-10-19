"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { setContext } from "@verse/hirecore-web/utils/ContextBridge";
export default function ProfileLink({
  user,
  context,
  children,
}: {
  user: { handle: string };
  context?: "worker" | "hirer";
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (context) {
      e.preventDefault();
      setContext(context);
      router.push(`/profile/${user.handle}`);
    }
  };

  return (
    <Link href={`/profile/${user.handle}`} onClick={handleClick}>
      {children}
    </Link>
  );
}
