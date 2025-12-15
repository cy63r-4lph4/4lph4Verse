"use client";

import Link from "next/link";
import ConnectWallet from "@verse/profile-web/components/ConnectWallet";

export const Navbar = () => {
  return (
    <>
      <header className="fixed top-0 left-0 w-full z-20 flex items-center justify-between px-8 py-6">
        <Link
          href="/"
          className="text-lg font-semibold text-cyan-200 hover:text-cyan-300"
        >
          4lph4Verse • Identity
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/guardians"
            className="text-sm text-slate-300 hover:text-cyan-300 transition"
          >
            Guardian Registry
          </Link>
          <Link
            href="/recover"
            className="text-sm text-slate-300 hover:text-cyan-300 transition"
          >
            Recovery
          </Link>

          <ConnectWallet />
        </div>
      </header>
    </>
  );
};
