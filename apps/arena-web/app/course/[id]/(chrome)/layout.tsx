"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import { CourseHeader } from "@verse/arena-web/app/course/[id]/modules/SectorSwitcher";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import useAuth from "@verse/arena-web/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { api } from "@verse/arena-web/lib/api";
import { useMySectors } from "@verse/arena-web/hooks/useMySectors";
import { ArenaContext } from "@verse/arena-web/app/course/[id]/ArenaContext";
import { Course, CurrentUser } from "@verse/arena-web/lib/course/types";
import CourseBottomNav from "@verse/arena-web/components/ui/CourseBottomNav";

function dicebearUrl(name: string) {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ id: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const { data: mySectors = [], isLoading: sectorsLoading } = useMySectors();

  const { data: courseDetail, isLoading: courseLoading, isError: courseError } = useQuery({
    queryKey: ["course-detail", params.id],
    queryFn: async () => (await api.get(`v1/arena/courses/${params.id}`)).data,
    enabled: !!params.id,
    retry: false,
  });

  if (courseError) {
    notFound();
  }

  if (authLoading || !user || sectorsLoading || courseLoading) {
    return (
      <div className="h-dvh w-full bg-black flex items-center justify-center">
        <p className="font-display text-white/30 uppercase tracking-[.3em] text-xs">Establishing uplink…</p>
      </div>
    );
  }

  const currentUser: CurrentUser = {
    name: user.username,
    level: 1, // no XP/leveling backend exists yet — honest placeholder
    rank: 0,  // no ranking backend exists yet — honest placeholder
    avatar: dicebearUrl(user.username),
  };

  const currentCourse: Course = courseDetail
    ? { id: courseDetail.id, code: courseDetail.code, name: courseDetail.title, members: courseDetail.fighterCount ?? 0 }
    : { id: params.id, code: "—", name: "Loading…", members: 0 };

  const allCourses: Course[] = mySectors.map((s: any) => ({
    id: s.id,
    code: s.code,
    name: s.title,
    members: 0, // mySectors doesn't return a member count — acceptable in the dropdown list, not misleading since it's not displayed there
  }));

  return (
    <ArenaContext.Provider value={{ currentUser, currentCourse, allCourses }}>
      <EnergyBackground className="h-dvh w-full flex flex-col overflow-hidden">
        <header className="shrink-0 sticky top-0 z-50">
          <CourseHeader currentCourse={currentCourse} courses={allCourses} currentUser={currentUser} />
        </header>

        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain">
          <div className="max-w-md mx-auto w-full px-4 pb-6">{children}</div>
        </main>

        <nav
          className="shrink-0 relative z-50 px-4 pb-4 pt-3"
          style={{ background: "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.92) 55%, transparent 100%)" }}
        >
          <CourseBottomNav />
        </nav>
      </EnergyBackground>
    </ArenaContext.Provider>
  );
}