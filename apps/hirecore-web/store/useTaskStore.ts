import { create } from "zustand";
import type { Task } from "@verse/hirecore-web/app/task/[id]/sections/types";

interface TaskStore {
  cache: Record<string, Task>;
  setTask: (id: string, task: Task) => void;
  getTask: (id: string) => Task | null;
  clearCache: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  cache: {},

  setTask: (id, task) =>
    set((state) => ({
      cache: { ...state.cache, [id]: task },
    })),

  getTask: (id) => get().cache[id] || null,

  clearCache: () => set({ cache: {} }),
}));
