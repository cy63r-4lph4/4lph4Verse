// app/page.tsx
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "4lph4Verse Core — Developer Preview",
  description:
    "Test your Verse apps before launch. Open the Faucet, connect a wallet, and run through your flows.",
};

type AppStatus = "live" | "alpha" | "soon";
type AppItem = {
  key: string;
  title: string;
  desc: string;
  status: AppStatus;
  href?: string; // only for live/alpha routes
  emoji?: string;
};

const APPS: AppItem[] = [
  // live
  {
    key: "faucet",
    title: "Faucet",
    desc: "Grab test tokens to power your flows & transactions.",
    status: "live",
    href: "/faucet",
    emoji: "💧",
  },

  // teased (locked)
  {
    key: "hirecore",
    title: "hireCore",
    desc: "On-chain gigs & bounties with escrow & reputation.",
    status: "soon",
    // href: "/hirecore", // enable later
    emoji: "👷‍♀️",
  },
  {
    key: "wallet",
    title: "Verse Wallet",
    desc: "Simple, developer-friendly wallet for Verse apps.",
    status: "soon",
    emoji: "👛",
  },
  {
    key: "dex",
    title: "Verse DEX",
    desc: "Swap, LP & analytics — optimized for speed and clarity.",
    status: "soon",
    emoji: "🔁",
  },

  {
    key: "leasevault",
    title: "leaseVault",
    desc: "Start with property. Scale to anything leased: spaces, storage, equipment — programmable & on-chain.",
    status: "soon",
    emoji: "🗝️",
  },
  {
    key: "vaultoflove",
    title: "Vault of Love",
    desc: "Community tips, grants & matching rounds.",
    status: "soon",
    // href: "/vaultoflove",
    emoji: "💝",
  },
  {
    key: "explorer",
    title: "Explorer",
    desc: "Human-readable blocks & transactions with rich labels.",
    status: "soon",
    emoji: "🛰️",
  },
  {
    key: "devconsole",
    title: "Dev Console",
    desc: "Keys, RPC, relayer stats and webhooks — in one place.",
    status: "soon",
    emoji: "🧰",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#080817] via-[#0b0b1f] to-black text-white">
      {/* Announcement Bar */}
      <div className="relative z-20 flex items-center justify-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80 backdrop-blur">
        <span className="rounded-md bg-gradient-to-br from-cyan-400 to-purple-500 px-2 py-0.5 font-semibold text-black">
          Alpha
        </span>
        <span>
          Developer Preview — the Verse isn’t live yet; SDKs are coming soon.
        </span>
      </div>

      {/* Background textures */}
      <BgFX />

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center px-6 pt-28 pb-14 text-center">
        <LogoBadge />
        <h1 className="mt-6 max-w-4xl bg-gradient-to-r from-cyan-300 via-sky-200 to-purple-300 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
          4lph4Verse Core — Pre-Launch Playground
        </h1>
        <p className="mt-5 max-w-2xl text-base text-white/80 sm:text-lg">
          Connect a wallet, claim test tokens, and run through your journeys
          while we prepare the full Verse & SDKs.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/faucet"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-3 font-semibold shadow-lg transition hover:from-purple-500 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
          >
            <span>Open Faucet</span>
            <ArrowIcon />
          </Link>

          <a
            href="#apps"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white/90 backdrop-blur transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          >
            Explore Verse Apps
          </a>
        </div>
      </section>

      {/* Apps Grid */}
      <section id="apps" className="relative z-10 mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-6 text-center text-2xl font-bold text-white/90">
          Verse Apps
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {APPS.map((app) => (
            <AppTile key={app.key} app={app} />
          ))}
        </div>
      </section>

      {/* What’s available now */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-28">
        <h3 className="mb-4 text-center text-xl font-semibold text-white/90">
          What you can do today
        </h3>
        <ul className="mx-auto grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
          <AvailItem text="Connect your wallet and switch testnets" />
          <AvailItem text="Claim tokens on the Faucet (live)" href="/faucet" />
          <AvailItem text="Prototype app flows with real signatures" />
          <AvailItem text="Share feedback to shape the Verse SDKs" />
        </ul>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-10 text-center">
        <p className="text-xs text-white/50">
          © 4lph4Verse — Developer Preview.
        </p>
      </footer>
    </main>
  );
}

/* ---------- Components ---------- */

function BgFX() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 45% at 50% -10%, rgba(56,189,248,0.25), transparent 60%), radial-gradient(35% 35% at 85% 15%, rgba(168,85,247,0.25), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "linear-gradient(to right, rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.12) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(60% 50% at 50% 20%, rgba(0,0,0,1), rgba(0,0,0,0))",
        }}
      />
    </>
  );
}

function LogoBadge() {
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 shadow backdrop-blur">
      <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 text-black font-extrabold">
        α
      </span>
      <span className="text-sm font-semibold tracking-wide text-white/80">
        4lph4Verse Core — Preview
      </span>
    </div>
  );
}

function StatusPill({ status }: { status: AppStatus }) {
  if (status === "live") {
    return (
      <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-300/30">
        Live
      </span>
    );
  }
  if (status === "alpha") {
    return (
      <span className="rounded-md bg-cyan-500/20 px-2 py-0.5 text-xs font-semibold text-cyan-200 ring-1 ring-cyan-300/30">
        Alpha
      </span>
    );
  }
  return (
    <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-200 ring-1 ring-amber-300/30">
      Coming soon
    </span>
  );
}

function LockIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 10V8a5 5 0 0 1 10 0v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function AppTile({ app }: { app: AppItem }) {
  const clickable = app.status === "live" && !!app.href;

  const TileBody = () => (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur transition hover:bg-white/10">
      <div className="mb-2 flex items-center gap-2">
        <StatusPill status={app.status} />
        <div className="font-semibold text-white">{app.title}</div>
        {app.emoji && <span className="ml-auto text-lg">{app.emoji}</span>}
      </div>

      <p className="text-sm text-white/80">{app.desc}</p>

      {/* Lock overlay for non-live apps */}
      {app.status !== "live" && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center rounded-2xl bg-black/40 opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
          <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90">
            <LockIcon />
            <span>Locked — coming soon</span>
          </div>
        </div>
      )}

      {/* Footer CTA: only an <a> when the tile itself is NOT wrapped */}
      <div className="mt-4">
        {clickable ? (
          // NO nested <a>: just a styled span when the whole card is a link
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-300 group-hover:text-cyan-200">
            Open
            <MiniArrow />
          </span>
        ) : app.status === "live" && app.href ? (
          // Fallback path if you ever make only the CTA clickable
          <Link
            href={app.href}
            className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
          >
            Open
            <MiniArrow />
          </Link>
        ) : (
          <span
            aria-disabled
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/50"
          >
            <LockIcon />
            <span>Not available yet</span>
          </span>
        )}
      </div>
    </div>
  );

  // Make the whole tile a link only when live
  return clickable ? (
    <Link
      href={app.href!}
      className="block focus:outline-none focus:ring-2 focus:ring-cyan-400/60 rounded-2xl"
    >
      <TileBody />
    </Link>
  ) : (
    <TileBody />
  );
}

function AvailItem({ text, href }: { text: string; href?: string }) {
  const inner = (
    <span className="inline-flex items-center gap-2">
      <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
      <span>{text}</span>
    </span>
  );
  return (
    <li className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 backdrop-blur">
      {href ? (
        <Link
          href={href}
          className="font-semibold text-cyan-300 hover:text-cyan-200"
        >
          {inner}
        </Link>
      ) : (
        inner
      )}
    </li>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="-rotate-45 size-4 transition group-hover:rotate-0"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 12h14m0 0-6-6m6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MiniArrow() {
  return (
    <svg
      className="size-3 -rotate-45"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 12h14m0 0-6-6m6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
