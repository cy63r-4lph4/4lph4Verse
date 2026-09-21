// components/ui/OfflineStatusBanner.tsx
"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function OfflineStatusBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Initialise from the browser's current state
    setIsOffline(!navigator.onLine);

    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-0 inset-x-0 z-[9999] flex items-center justify-center gap-2 px-4 py-2 bg-amber-900/90 backdrop-blur-sm border-b border-amber-500/30 text-amber-300 shadow-lg animate-in slide-in-from-top duration-300"
    >
      <WifiOff size={12} className="shrink-0" />
      <p className="font-mono text-[10px] uppercase tracking-widest">
        Offline — showing cached intel. Reconnect to sync.
      </p>
    </div>
  );
}
