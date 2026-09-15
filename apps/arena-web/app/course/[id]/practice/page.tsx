"use client";

import { useParams } from "next/navigation";
import { redirect } from "next/navigation";

/** Redirect /practice to the dungeon kiosk page */
export default function PracticePage() {
  const params = useParams<{ id: string }>();
  redirect(`/course/${params.id}/dungeon`);
}