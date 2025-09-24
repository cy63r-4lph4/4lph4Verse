"use client";

import { useState } from "react";
import { Navbar } from "@verse/ui/Navbar/Navbar";
import type { NavbarItem } from "@verse/ui/Navbar/Navbar.types";
import ConnectWalletButton from "@verse/sdk/ConnectWalletButton";
import { workerNavItems, clientNavItems } from "./navItems";
import { Settings, Briefcase, Users } from "lucide-react";

export default function HireCoreNavbar() {
  const [userRole, setUserRole] = useState<"worker" | "client">("worker");
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const menuItems: NavbarItem[] =
    userRole === "worker" ? workerNavItems : clientNavItems;

  return (
    <Navbar
      logo={
        <span className="text-2xl font-extrabold font-orbitron bg-gradient-to-r from-indigo-500 to-emerald-400 bg-clip-text text-transparent">
          HireCore
        </span>
      }
      menuItems={menuItems}
      rightControls={
        <div className="flex items-center gap-4 relative">
          {/* Wallet */}
          <ConnectWalletButton
            variant="secondary"
            rounded="lg"
            className="text-sm font-medium"
          />

         

          {/* Role switcher */}
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
                    setUserRole("worker");
                    setShowRoleMenu(false);
                  }}
                  className={`flex items-center gap-2 w-full px-4 py-2 text-sm rounded-md hover:bg-gray-800 transition ${
                    userRole === "worker" ? "text-indigo-400" : "text-gray-200"
                  }`}
                >
                  <Briefcase className="w-4 h-4" /> Worker
                </button>
                <button
                  onClick={() => {
                    setUserRole("client");
                    setShowRoleMenu(false);
                  }}
                  className={`flex items-center gap-2 w-full px-4 py-2 text-sm rounded-md hover:bg-gray-800 transition ${
                    userRole === "client" ? "text-emerald-400" : "text-gray-200"
                  }`}
                >
                  <Users className="w-4 h-4" /> Client
                </button>
              </div>
            )}
          </div>
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
