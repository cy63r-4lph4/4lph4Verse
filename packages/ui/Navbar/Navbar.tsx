"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useOutsideClick } from "@verse/sdk";
import type { NavbarItem, NavbarTheme } from "./Navbar.types";

type NavbarProps = {
  logo: React.ReactNode;
  logoSm?: React.ReactNode;
  menuItems: NavbarItem[];
  rightControls?: React.ReactNode;
  theme?: NavbarTheme;
  mobileExtras?: React.ReactNode; // 👈 NEW
};

export const Navbar: React.FC<NavbarProps> = ({
  logo,
  logoSm,
  menuItems,
  rightControls,
  theme = {},
  mobileExtras,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(mobileMenuRef, () => setIsMobileMenuOpen(false));

  const linkBase =
    "flex flex-row items-center gap-2 px-3 py-2 rounded-md transition";
  const linkDefault =
    theme.linkStyle || "text-foreground hover:text-primary hover:bg-primary/10";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ${
        theme.backdrop ||
        "bg-zinc-950/80 backdrop-blur-md border-b border-white/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between h-14 sm:h-16">
        {/* Logo */}
        <div className={`${theme.logoStyle || "text-xl font-bold"} cursor-pointer`} onClick={() => window.location.href = '/'}>
          <span className="hidden sm:inline">{logo}</span>
          <span className="sm:hidden text-lg font-bold">{logoSm}</span>
        </div>

        {/* Tablet Menu (icon-only) */}
        <div className="hidden sm:flex md:hidden items-center gap-3">
          {menuItems.map(({ href, icon: Icon, label }) =>
            href ? (
              <Link
                key={label}
                href={href}
                className="p-2 rounded-lg hover:bg-indigo-500/20"
              >
                {Icon && <Icon className="w-5 h-5 text-indigo-400" />}
              </Link>
            ) : null
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3 space-x-4">
          {menuItems.map(({ href, label, icon: Icon, onClick }) => {
            const ItemContent = (
              <span className="flex items-center gap-2">
                {Icon && <Icon className="w-5 h-5" />}
                <span className="text-sm font-medium">{label}</span>
              </span>
            );

            return href ? (
              <Link
                key={label}
                href={href}
                className={`${linkBase} ${linkDefault}`}
              >
                {ItemContent}
              </Link>
            ) : (
              <button
                key={label}
                onClick={onClick}
                className={`${linkBase} ${linkDefault}`}
              >
                {ItemContent}
              </button>
            );
          })}
        </div>

        {/* Right Controls (hidden on mobile) */}
        <div className="flex items-center gap-3">
          {rightControls}
        </div>

        {/* Mobile Toggle */}
        <button
          className="sm:hidden p-2 rounded-lg hover:bg-white/10 transition"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6 text-white" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="absolute top-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-xl border-b border-white/10 shadow-lg rounded-b-2xl"
          >
            <div className="flex flex-col px-6 py-4">
              {menuItems.map(({ href, label, icon: Icon, onClick }) =>
                href ? (
                  <Link
                    key={label}
                    href={href}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-200 hover:bg-indigo-500/20 hover:text-indigo-400 transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {Icon && <Icon className="w-5 h-5 text-indigo-400" />}
                    <span className="text-base font-medium">{label}</span>
                  </Link>
                ) : (
                  <button
                    key={label}
                    onClick={() => {
                      onClick?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-200 hover:bg-indigo-500/20 hover:text-indigo-400 transition"
                  >
                    {Icon && <Icon className="w-5 h-5 text-indigo-400" />}
                    <span className="text-base font-medium">{label}</span>
                  </button>
                )
              )}

              {mobileExtras && (
                <div className="mt-4 border-t border-white/10 pt-4">
                  {mobileExtras}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
