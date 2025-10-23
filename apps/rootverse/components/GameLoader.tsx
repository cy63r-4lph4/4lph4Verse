"use client";
import { useEffect } from "react";

export const GameLoader = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="text-center">
        <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
          Initializing Genesis Gateway...
        </h1>
        <div className="mt-8 h-1.5 w-64 mx-auto bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-[load_3s_ease-in-out]" />
        </div>
      </div>
    </div>
  );
};
