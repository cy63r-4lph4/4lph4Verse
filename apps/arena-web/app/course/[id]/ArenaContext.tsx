"use client";

import { createContext, use, useContext } from "react";

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