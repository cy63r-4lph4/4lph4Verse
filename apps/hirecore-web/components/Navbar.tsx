"use client";

import { useState } from "react";
import Image from "next/image";
import { Navbar } from "@verse/ui/Navbar/Navbar";
import type { NavbarItem } from "@verse/ui/Navbar/Navbar.types";
import ConnectWalletButton from "@verse/ui/wallet/ConnectWalletButton";
import { workerNavItems, clientNavItems } from "./navItems";
import { Settings, Briefcase, Users } from "lucide-react";
import { useUserRole } from "@verse/hirecore-web/context/UserRoleContext";

export default function HireCoreNavbar() {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const { role, setRole } = useUserRole();

  const menuItems: NavbarItem[] =
    role === "worker" ? workerNavItems : clientNavItems;

  return (
    <Navbar
      logo={
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="HireCore Logo"
            width={52}
            height={52}
            className="rounded-md"
          />
          <span className="text-2xl font-extrabold font-orbitron bg-gradient-to-r from-indigo-500 to-emerald-400 bg-clip-text text-transparent">
            HireCore
          </span>
        </div>
      }
      logoSm={
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="HireCore Logo"
            width={40}
            height={40}
            className="rounded-md"
          />
        </div>
      }
      menuItems={menuItems}
      rightControls={
        <>
          {/* Wallet Connect (hidden on mobile handled in Navbar) */}
          <ConnectWalletButton
            variant="secondary"
            rounded="lg"
            className="text-sm font-medium"
          />

          {/* Role Switcher (desktop only) */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setShowRoleMenu((prev) => !prev)}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg bg-gray-900 border border-white/10">
                <button
                  onClick={() => {
                    setRole("worker");
                    setShowRoleMenu(false);
                  }}
                  className={`flex items-center gap-2 w-full px-4 py-2 text-sm rounded-md hover:bg-gray-800 transition ${
                    role === "worker" ? "text-indigo-400" : "text-gray-200"
                  }`}
                >
                  <Briefcase className="w-4 h-4" /> Worker
                </button>
                <button
                  onClick={() => {
                    setRole("client");
                    setShowRoleMenu(false);
                  }}
                  className={`flex items-center gap-2 w-full px-4 py-2 text-sm rounded-md hover:bg-gray-800 transition ${
                    role === "client" ? "text-emerald-400" : "text-gray-200"
                  }`}
                >
                  <Users className="w-4 h-4" /> Client
                </button>
              </div>
            )}
          </div>
        </>
      }
      mobileExtras={
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setRole("worker")}
            className={`flex items-center gap-2 px-3 py-3 rounded-lg text-sm transition ${
              role === "worker"
                ? "text-indigo-400 bg-indigo-500/10"
                : "text-gray-200 hover:bg-gray-800"
            }`}
          >
            <Briefcase className="w-5 h-5" /> Worker
          </button>

          <button
            onClick={() => setRole("client")}
            className={`flex items-center gap-2 px-3 py-3 rounded-lg text-sm transition ${
              role === "client"
                ? "text-emerald-400 bg-emerald-500/10"
                : "text-gray-200 hover:bg-gray-800"
            }`}
          >
            <Users className="w-5 h-5" /> Client
          </button>
        </div>
      }
      theme={{
        backdrop:
          "backdrop-blur-xl glass-effect border-b border-white/20 shadow-lg",
        linkStyle:
          "text-gray-200 font-medium transition hover:text-indigo-600 hover:bg-indigo-50 rounded-lg px-3 py-2",
        logoStyle: "text-2xl font-bold tracking-wide",
      }}
    />
  );
}
