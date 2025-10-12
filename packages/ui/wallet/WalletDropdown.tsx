import { useRef } from "react";
import { useOutsideClick } from "@verse/sdk/hooks/useOutsideClick";
import { Coins, Copy, LogOut, User2 } from "lucide-react";
import { AddressUtils } from "@verse/sdk";

export default function WalletDropdown({
  account,
  openChainModal,
  menuOpen,
  setMenuOpen,
}: {
  account: any;
  openChainModal: () => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const cacheKey = `verseProfile:${account?.address.toLowerCase()}`;
  const cached = localStorage.getItem(cacheKey);
  const profile = cached ? JSON.parse(cached) : null;

  // close when clicking outside
  useOutsideClick(menuRef, () => setMenuOpen(false));

  if (!menuOpen) return null;

  return (
    <div
      ref={menuRef}
      className={`
        z-50 p-4 w-[90vw] max-w-sm rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl bg-zinc-900/90
        md:absolute md:top-12 md:right-0 md:w-64
        fixed top-16 right-4
      `}
    >
      {/* Wallet Address */}
      <div className="mb-3">
        <p className="text-xs font-mono break-words text-gray-400">
          {profile?.displayName || "Unnamed User"}
        </p>
        <p className="text-sm font-mono break-words text-gray-200">
          {AddressUtils.shorten(account?.address || "")}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {/* Copy Address */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(account?.address || "");
            setMenuOpen(false);
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-indigo-500/20 hover:text-indigo-400 transition"
        >
          <Copy className="w-4 h-4 text-indigo-400" /> Copy Address
        </button>

        {/* Switch Network */}
        <button
          onClick={openChainModal}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-yellow-500/20 hover:text-yellow-400 transition"
        >
          <Coins className="w-4 h-4 text-yellow-400" /> Switch Network
        </button>

        {/* Faucet Link */}
        <a
          href="https://4lph4-verse-verse-core.vercel.app/faucet"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-emerald-500/20 hover:text-emerald-400 transition"
        >
          <Coins className="w-4 h-4 text-emerald-400" /> Claim Faucet
        </a>

        {/* 🔹 View Profile */}
        {profile && (
          <a
            href={`/profile/${profile?.handle || account?.address}`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-blue-500/20 hover:text-blue-400 transition"
          >
            <User2 className="w-4 h-4 text-blue-400" /> View Profile
          </a>
        )}

        {/* Disconnect */}
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-red-500/20 hover:text-red-400 transition"
        >
          <LogOut className="w-4 h-4 text-red-400" /> Disconnect
        </button>
      </div>
    </div>
  );
}
