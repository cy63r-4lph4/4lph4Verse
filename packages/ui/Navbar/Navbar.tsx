"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useOutsideClick } from "../../sdk/hooks/useOutsideClick";
import type { NavbarItem, NavbarTheme } from "./Navbar.types";

type NavbarProps = {
  logo: React.ReactNode;
  menuItems: NavbarItem[];
  rightControls?: React.ReactNode;
  theme?: NavbarTheme;
};

export const Navbar: React.FC<NavbarProps> = ({
  logo,
  menuItems,
  rightControls,
  theme = {},
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
        theme.backdrop || "bg-white/90 backdrop-blur border-b border-border"
      }`}
    >
      {/* Container */}
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between h-16">
        {/* Logo */}
        <div className={theme.logoStyle || "text-xl font-bold"}>{logo}</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex  items-center gap-3 space-x-4">
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

        {/* Right Controls */}
        <div className="flex items-center gap-4">{rightControls}</div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg  hover:bg-black/5 transition"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6 text-white" />
          ) : (
            <Bars3Icon className={`w-6 h-6 text-foreground text-white`} />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`md:hidden border-t border-white/10 backdrop-blur-xl glass-effect shadow-xl`}
          >
            <div className="flex flex-col space-y-2 px-6 py-4">
              {menuItems.map(({ href, label, icon: Icon, onClick }) => {
                const ItemContent = (
                  <span className="flex items-center gap-3">
                    {Icon && <Icon className="w-5 h-5 text-indigo-400" />}
                    <span className="text-base font-medium">{label}</span>
                  </span>
                );

                return href ? (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg transition 
                text-gray-200 hover:bg-indigo-500/20 hover:text-indigo-400`}
                  >
                    {ItemContent}
                  </Link>
                ) : (
                  <button
                    key={label}
                    onClick={() => {
                      onClick?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center px-4 py-3 rounded-lg transition 
                text-gray-200 hover:bg-indigo-500/20 hover:text-indigo-400`}
                  >
                    {ItemContent}
                  </button>
                );
              })}

              {/* Divider for clarity */}
              <div className="h-px bg-white/10 my-3" />

              {/* Right Controls (e.g. Wallet, Role Switcher) */}
              <div className="flex flex-col gap-2">{rightControls}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
