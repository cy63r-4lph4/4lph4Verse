"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Navbar } from "@verse/ui/Navbar/Navbar";
import type { NavbarItem } from "@verse/ui/Navbar/Navbar.types";
import { workerNavItems, clientNavItems } from "./navItems";
import { Briefcase, Users } from "lucide-react";
import { useUserRole } from "@verse/hirecore-web/context/UserRoleContext";
import VerseConnectButton from "@verse/ui/wallet/VerseConnectButton";
import type { PersonaField } from "@verse/ui/profile/components/core/PersonalQuickStep";

/* ───────────────────────── Persona Fields ───────────────────────── */

const hirecorePersonaFields: PersonaField[] = [
  {
    type: "select",
    name: "role",
    label: "How do you want to use HireCore?",
    options: ["Worker", "Client", "Both"],
    required: true,
  },
  {
    type: "select",
    name: "accountType",
    label: "Account Type",
    options: ["Individual", "Business"],
    required: true,
  },
  {
    type: "tags",
    name: "skills",
    label: "Skills / Services Offered",
    placeholder: "e.g. Electrician, Plumber, Mobile Developer",
  },
  {
    type: "tags",
    name: "hiringCategories",
    label: "What kind of work do you hire for?",
    placeholder: "e.g. Plumbing, Graphic Design, Construction",
  },
  {
    type: "select",
    name: "availability",
    label: "Availability",
    options: ["Full-time", "Part-time", "Weekends", "On Call", "Remote"],
  },
  {
    type: "select",
    name: "preferredPayment",
    label: "Preferred Payment Method",
    options: ["CØRE Token", "USDT", "Celo cUSD", "Other"],
  },
];

/* ───────────────────────── Component ───────────────────────── */

export default function HireCoreNavbar() {
  const { role, setRole } = useUserRole();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const menuItems: NavbarItem[] =
    role === "worker" ? workerNavItems : clientNavItems;

  return (
    <Navbar
      /* ───────────────────────── Brand ───────────────────────── */
      logo={
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="HireCore Logo"
            width={48}
            height={48}
            className="rounded-md"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-2xl font-extrabold font-orbitron bg-gradient-to-r from-indigo-500 to-emerald-400 bg-clip-text text-transparent">
              HireCore
            </span>
            <span className="hidden lg:block text-xs text-white/60 tracking-wide">
              On-chain work & hiring
            </span>
          </div>

          {/* Active Role Badge */}
          <span
            className={clsx(
              "hidden md:inline-flex ml-2 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase",
              role === "worker"
                ? "bg-indigo-500/15 text-indigo-400"
                : "bg-emerald-500/15 text-emerald-400"
            )}
          >
            {role}
          </span>
        </div>
      }
      logoSm={
        <Image
          src="/logo.png"
          alt="HireCore Logo"
          width={40}
          height={40}
          className="rounded-md"
        />
      }

      /* ───────────────────────── Navigation ───────────────────────── */
      menuItems={menuItems}
      dapp="hirecore"
      personaFields={hirecorePersonaFields}

      /* ───────────────────────── Status Cluster ───────────────────────── */
      rightControls={
        <div className="flex items-center gap-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 px-3 py-2">
          {/* Wallet */}
          <VerseConnectButton
            dapp="hirecore"
            personaFields={hirecorePersonaFields}
            variant="glass"
            rounded="lg"
            className="text-sm font-medium"
            showBalance
          />

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu((o) => !o)}
              className={clsx(
                "flex items-center justify-center w-9 h-9 rounded-full transition",
                role === "worker"
                  ? "bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25"
                  : "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
              )}
              aria-label="Switch role"
            >
              {role === "worker" ? (
                <Briefcase className="w-5 h-5" />
              ) : (
                <Users className="w-5 h-5" />
              )}
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-gray-900 border border-white/10 shadow-xl overflow-hidden z-50">
                <div className="px-3 py-2 text-xs uppercase tracking-wider text-white/40">
                  Switch role
                </div>

                <button
                  onClick={() => {
                    setRole("worker");
                    setShowRoleMenu(false);
                  }}
                  className={clsx(
                    "flex items-center gap-2 w-full px-4 py-2 text-sm transition",
                    role === "worker"
                      ? "bg-indigo-500/10 text-indigo-400"
                      : "text-gray-200 hover:bg-white/5"
                  )}
                >
                  <Briefcase className="w-4 h-4" />
                  Worker
                </button>

                <button
                  onClick={() => {
                    setRole("client");
                    setShowRoleMenu(false);
                  }}
                  className={clsx(
                    "flex items-center gap-2 w-full px-4 py-2 text-sm transition",
                    role === "client"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-gray-200 hover:bg-white/5"
                  )}
                >
                  <Users className="w-4 h-4" />
                  Client
                </button>
              </div>
            )}
          </div>
        </div>
      }

      /* ───────────────────────── Mobile Drawer Extras ───────────────────────── */
      mobileExtras={
        <div className="flex flex-col gap-2">
          <div className="text-xs uppercase tracking-wider text-white/40 px-3">
            Switch role
          </div>

          <button
            onClick={() => setRole("worker")}
            className={clsx(
              "flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition",
              role === "worker"
                ? "bg-indigo-500/15 text-indigo-400"
                : "text-gray-200 hover:bg-white/5"
            )}
          >
            <Briefcase className="w-5 h-5" />
            Worker
          </button>

          <button
            onClick={() => setRole("client")}
            className={clsx(
              "flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition",
              role === "client"
                ? "bg-emerald-500/15 text-emerald-400"
                : "text-gray-200 hover:bg-white/5"
            )}
          >
            <Users className="w-5 h-5" />
            Client
          </button>
        </div>
      }

      /* ───────────────────────── Theme ───────────────────────── */
      theme={{
        backdrop:
          "backdrop-blur-xl bg-black/40 border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
        linkStyle:
          "text-gray-200 font-medium transition hover:text-indigo-400 hover:bg-white/5 rounded-lg px-3 py-2",
        logoStyle: "font-bold tracking-wide",
      }}
    />
  );
}
