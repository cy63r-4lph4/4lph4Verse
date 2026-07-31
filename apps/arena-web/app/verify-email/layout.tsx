import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Identity // ARENA",
  description: "Verify your entry into the Arena.",
  openGraph: {
    title: "Verify Identity // ARENA",
    description: "Verify your entry into the Arena.",
    images: ["/images/arena-og-banner.png"], // Assuming this exists or falls back to default
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
