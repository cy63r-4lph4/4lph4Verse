import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tournament Duel Invite",
  description: "You've been challenged to a live academic duel! Create your combatant or sign in to enter the tournament arena on DeskMate.",
  openGraph: {
    title: "Tournament Duel Invite | Arena",
    description: "You've been challenged to a live academic duel! Create your combatant or sign in to enter the tournament arena on DeskMate.",
    images: ["/og/arena-og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tournament Duel Invite | Arena",
    description: "You've been challenged to a live academic duel! Enter the tournament arena on DeskMate.",
    images: ["/og/arena-og.png"],
  },
};

export default function JoinTournamentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
