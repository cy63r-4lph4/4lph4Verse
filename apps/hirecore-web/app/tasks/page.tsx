"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Briefcase } from "lucide-react";
import { Input } from "@verse/hirecore-web/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@verse/hirecore-web/components/ui/select";
import { Button } from "@verse/hirecore-web/components/ui/button";
import { TaskSkeleton } from "@verse/hirecore-web/components/tasks/Skeleton";
import { TaskCard } from "@verse/hirecore-web/components/tasks/TaskCard";
import { useTasks } from "@verse/hirecore-web/hooks/useTasks";
import { CATEGORIES, LOCATIONS, SERVICES } from "@verse/hirecore-web/utils/Constants";
import { useChainId } from "wagmi";
import type { Task } from "@verse/hirecore-web/app/task/[id]/sections/types";

export default function TasksPage() {
  const [filters, setFilters] = useState({
    category: "all",
    location: "all",
    search: "",
  });

  const chainId = useChainId() || 11142220;
  const { data: tasks = [], isLoading, fetchNextPage } = useTasks(chainId, filters);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        fetchNextPage?.();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 🌈 Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500">
              Available Tasks
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-purple-500 rounded-full mt-2"></div>
          </div>

          <div className="relative w-full sm:w-72">
            <Input
              placeholder="Search by keyword..."
              className="bg-white/5 border-white/10 text-white pl-10"
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </motion.div>

        {/* ⚡ Quick Category Bar */}
        <QuickCategoryBar
          active={filters.category}
          onSelect={(v) => setFilters((f) => ({ ...f, category: v }))}
        />

        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          <Select
            onValueChange={(v) => setFilters((f) => ({ ...f, category: v }))}
            value={filters.category}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10">
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(v) => setFilters((f) => ({ ...f, location: v }))}
            value={filters.location}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white w-full">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10">
              {LOCATIONS.map((loc) => (
                <SelectItem key={loc.value} value={loc.value}>
                  {loc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 🧮 Count */}
        {!isLoading && (
          <p className="text-gray-300">
            Found{" "}
            <span className="text-emerald-400 font-semibold">{tasks.length}</span>{" "}
            {tasks.length === 1 ? "task" : "tasks"}
          </p>
        )}

        {/* 🧱 Tasks Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <TaskSkeleton />
              </motion.div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center text-gray-400 py-24 space-y-4"
          >
            <div className="relative">
              <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 rounded-full"></div>
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10">
                <Briefcase className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <h3 className="text-white text-lg font-semibold">
              No tasks available
            </h3>
            <p className="text-gray-400 max-w-sm">
              Try changing your filters or check back soon — new jobs are posted frequently.
            </p>
            <Button
              onClick={() =>
                setFilters({ category: "all", location: "all", search: "" })
              }
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md text-white font-medium hover:scale-105 transition-transform"
            >
              Reset Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {tasks.map((task: Task, index: number) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------ */
/* 🎨 Category Bar                                 */
/* ------------------------------------------------ */
function QuickCategoryBar({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex gap-3 overflow-x-auto py-3 scrollbar-thin scrollbar-thumb-emerald-500/40 scrollbar-track-transparent">
      {SERVICES.map(({ icon: Icon, name, color }) => {
        const isActive = active === name.toLowerCase();
        return (
          <motion.button
            key={name}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(isActive ? "all" : name.toLowerCase())}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 ${
              isActive
                ? `bg-gradient-to-r ${color} text-white shadow-lg`
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            <Icon className="w-4 h-4" />
            {name}
          </motion.button>
        );
      })}
    </div>
  );
}
