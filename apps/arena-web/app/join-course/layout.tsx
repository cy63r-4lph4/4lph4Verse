import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Course Sector",
  description: "Initialize neural link to join your course sector. Create an account or sign in to enter the battleground on Arena by DeskMate.",
  openGraph: {
    title: "Join Course Sector | Arena",
    description: "Initialize neural link to join your course sector. Create an account or sign in to enter the battleground on Arena by DeskMate.",
    images: ["/og/arena-og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Join Course Sector | Arena",
    description: "Initialize neural link to join your course sector on Arena by DeskMate.",
    images: ["/og/arena-og.png"],
  },
};

export default function JoinCourseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
