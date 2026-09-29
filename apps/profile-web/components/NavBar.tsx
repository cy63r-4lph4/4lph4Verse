"use client";

import Link from "next/link";
import ConnectWallet from "@verse/profile-web/components/ConnectWallet";

export const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 p-4">
      <header
        className="
          mx-auto max-w-7xl
          flex items-center justify-between
          px-6 py-3
          hud-panel
          shadow-[0_0_20px_rgba(0,240,255,0.1)]
        "
      >
        <Link
          href="/"
          className="text-sm font-mono font-bold text-alpha-cyan hover:text-white transition tracking-widest text-glow"
        >
          SYS.ID // 4LPH4VERSE
        </Link>

        <nav className="flex items-center gap-8">
          <Link
            href="/guardians"
            className="text-xs font-mono text-slate-400 hover:text-alpha-cyan transition tracking-widest uppercase relative group"
          >
            <span className="opacity-0 group-hover:opacity-100 absolute -left-3 text-alpha-cyan transition-opacity">[</span>
            Guardians
            <span className="opacity-0 group-hover:opacity-100 absolute -right-3 text-alpha-cyan transition-opacity">]</span>
          </Link>

          <Link
            href="/recover"
            className="text-xs font-mono text-slate-400 hover:text-alpha-magenta transition tracking-widest uppercase relative group"
          >
            <span className="opacity-0 group-hover:opacity-100 absolute -left-3 text-alpha-magenta transition-opacity">[</span>
            Recovery
            <span className="opacity-0 group-hover:opacity-100 absolute -right-3 text-alpha-magenta transition-opacity">]</span>
          </Link>

          <ConnectWallet />
        </nav>
        
        {/* Decorative HUD Elements */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-alpha-cyan opacity-50" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-alpha-cyan opacity-50" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-alpha-cyan opacity-50" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-alpha-cyan opacity-50" />
      </header>
    </div>
  );
};
