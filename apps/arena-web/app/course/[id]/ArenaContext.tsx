"use client";

import { Course, CurrentUser } from "@verse/arena-web/lib/course/types";
import { createContext, use, useContext } from "react";


export interface ArenaContextValue {
  currentUser: CurrentUser;
  currentCourse: Course;
  allCourses: Course[];
}

export const ArenaContext = createContext<ArenaContextValue | null>(null);

export function useArena() {
  const ctx = useContext(ArenaContext);
  if (!ctx) throw new Error("useArena must be used within CourseLayout");
  return ctx;
}