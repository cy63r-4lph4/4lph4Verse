"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Filter, Search } from "lucide-react";

import { Input } from "@verse/hirecore-web/components/ui/input";
import { Button } from "@verse/hirecore-web/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@verse/hirecore-web/components/ui/select";
import { TaskSkeleton } from "@verse/hirecore-web/components/tasks/Skeleton";
import { useTasks } from "@verse/hirecore-web/hooks/useTasks";
import { CATEGORIES, LOCATIONS } from "@verse/hirecore-web/utils/Constants";
import { useChainId } from "wagmi";
import { TaskCard } from "@verse/hirecore-web/components/tasks/TaskCard";
import { Task } from "@verse/hirecore-web/app/task/[id]/sections/types";

/* --------------------------------------------------
 * Main component
 * --------------------------------------------------
 */

export default function TasksPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [urgency] = useState("all");
  const [minBudget] = useState<number>(0);

  const filters = { category, location, urgency, minBudget, searchTerm };
  const chainId = useChainId() || 11142220;

  const {
    data: tasks = [],
    isLoading,
    hasMore,
    fetchNextPage,
  } = useTasks(chainId, filters);

  // 🌀 Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        fetchNextPage?.();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage]);

  return (
    <div className="min-h-screen">
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-4">
            Find Tasks
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover opportunities to earn{" "}
            <span className="core-token">CØRE</span> tokens by providing your
            skills and services.
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="ml-4 bg-white/5 hover:bg-white/10 rounded-lg flex"
          >
            <Filter className="w-5 h-5 text-blue-400" />
          </Button>
        </motion.div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-effect rounded-xl p-6 mb-8 border border-white/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* 🔍 Search Input */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* 📂 Category Filter */}
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  {CATEGORIES.map((cat) => (
                    <SelectItem
                      key={cat.value}
                      value={cat.value}
                      className="text-white hover:bg-white/10"
                    >
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 📍 Location Filter */}
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  {LOCATIONS.map((loc) => (
                    <SelectItem
                      key={loc.value}
                      value={loc.value}
                      className="text-white hover:bg-white/10"
                    >
                      {loc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}

        {/* Count */}
        <p className="text-gray-300 mb-6">
          Found{" "}
          <span className="text-blue-400 font-semibold">{tasks.length}</span>{" "}
          tasks
        </p>

        {/* Tasks Grid */}
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
        ) : tasks.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {tasks.map((task: Task, index: number) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <Search className="mx-auto mb-4 w-10 h-10 opacity-70" />
            <p>No tasks found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
