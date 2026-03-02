"use client";

import React, { createContext, useContext } from "react";
import { CourseBottomNav } from "@verse/arena-web/app/course/[id]/modules/BottomNav";
import { CourseHeader } from "@verse/arena-web/app/course/[id]/modules/SectorSwitcher";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import { ArenaContext } from "@verse/arena-web/app/course/[id]/ArenaContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Course {
  id: string;
  code: string;
  name: string;
  members: number;
}

export interface CurrentUser {
  name: string;
  level: number;
  avatar: string;
}

interface ArenaContextValue {
  currentUser: CurrentUser;
  currentCourse: Course;
  allCourses: Course[];
}

// ─── Context ──────────────────────────────────────────────────────────────────
// Putting shared data in context means child screens (CourseHome, Duels, etc.)
// can read it without prop drilling through every layout level.


export function useArena() {
  const ctx = useContext(ArenaContext);
  if (!ctx) throw new Error("useArena must be used within CourseLayout");
  return ctx;
}

// ─── Mock data (replace with real auth / data fetching) ───────────────────────

const currentCourse: Course = {
  id: "sector-7g",
  code: "CS_101",
  name: "DATA_STRUCTURES",
  members: 124,
};

const allCourses: Course[] = [
  currentCourse,
  { id: "sector-42", code: "MATH_201", name: "CALCULUS_II", members: 89 },
];

const currentUser: CurrentUser = {
  name: "SHADOW_OPERATOR",
  level: 14,
  avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=shadow",
};

// ─── Layout ───────────────────────────────────────────────────────────────────

/**
 * SPACING SYSTEM
 * --header-h  : height of the fixed top bar
 * --nav-h     : height of the fixed bottom nav bar
 * --nav-pad   : total bottom clearance (nav + safe area buffer)
 *
 * Using CSS variables means if the header height ever changes,
 * you update ONE value and the scroll offset adjusts automatically.
 */
export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <ArenaContext.Provider value={{ currentUser, currentCourse, allCourses }}>
      <EnergyBackground
        className="h-dvh w-full flex flex-col"
        style={
          {
            "--header-h": "72px",
            "--nav-h": "72px",
            "--nav-pad": "96px", // nav-h + 24px safe-area breathing room
          } as React.CSSProperties
        }
      >
        {/* ── 1. FIXED HEADER ─────────────────────────────────────────────── */}
        <header
          className="fixed top-0 left-0 right-0 z-50"
          style={{ height: "var(--header-h)" }}
        >
          <CourseHeader
            currentCourse={currentCourse}
            courses={allCourses}
            currentUser={currentUser}
          />
        </header>

        {/* ── 2. SCROLLABLE CONTENT AREA ──────────────────────────────────── */}
        {/*
         * padding-top pushes content below the fixed header.
         * padding-bottom clears the fixed bottom nav.
         * overscroll-contain prevents the outer page from bouncing
         * when the user scrolls to the edge of this container.
         */}
        <main
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-hide w-full"
          style={{
            paddingTop: "var(--header-h)",
            paddingBottom: "var(--nav-pad)",
          }}
        >
          <div className="max-w-md mx-auto w-full px-4">
            {children}
          </div>
        </main>

        {/* ── 3. FIXED BOTTOM NAV ─────────────────────────────────────────── */}
        {/*
         * The gradient fade is purely decorative — it sits on top of the
         * scroll area to create the "content fades into the nav" illusion.
         * pointer-events-none on the gradient, pointer-events-auto on the nav
         * itself so clicks pass through the transparent region correctly.
         *
         * Both layers share the same fixed positioning so they stack cleanly
         * without the parent/child pointer-events trick being fragile.
         */}
        {/* Gradient fade overlay — non-interactive */}
        <div
          className="fixed bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: "var(--nav-pad)",
            background:
              "linear-gradient(to top, rgba(5,5,5,1) 0%, rgba(5,5,5,0.85) 50%, transparent 100%)",
            zIndex: 59,
          }}
        />

        {/* Nav bar — interactive */}
        <nav
          className="fixed bottom-0 left-0 right-0 z-[60] px-4 pb-4"
          style={{ height: "var(--nav-h)" }}
        >
          <CourseBottomNav />
        </nav>
      </EnergyBackground>
    </ArenaContext.Provider>
  );
}