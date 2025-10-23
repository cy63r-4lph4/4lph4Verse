"use client";
import { Button } from "@verse/ui/components/ui/button";
import Image from "next/image";

export const Navigation = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b border-cyan-400/30">
    <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
      <div className="flex items-center gap-3">
          <Image src={"/dragon_sigil.png"} alt="verse sigil" width={50} height={50} />{" "}
        <h1 className="text-xl font-bold text-cyan-400">Genesis Gateway</h1>
      </div>
      <Button
        variant="outline"
        className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
      >
        Connect Wallet
      </Button>
    </div>
  </nav>
);
