"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Filter, Search, MapPin, Clock, Star } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@verse/hirecore-web/components/ui/card";
import { Input } from "@verse/hirecore-web/components/ui/input";
import { Badge } from "@verse/hirecore-web/components/ui/badge";
import { Button } from "@verse/hirecore-web/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@verse/hirecore-web/components/ui/select";
import { TaskSkeleton } from "@verse/hirecore-web/components/Skeleton";
import { useTasks } from "@verse/hirecore-web/hooks/useTasks";
import { CATEGORIES, LOCATIONS } from "@verse/hirecore-web/utils/Constants";
import type {
  TaskDisplayType,
  UrgencyType,
} from "@verse/hirecore-web/types/task";
import { useChainId } from "wagmi";

interface HireCoreTask {
  id: number;
  hirer: `0x${string}`;
  budget: number;
  deposit: number;
  expiry: number;
  metadata: {
    title: string;
    description: string;
    category?: string;
    location?: string;
    urgency?: string;
  };
  category: string;
  location: string;
  urgency: string;
}

export default function TasksPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [urgency, setUrgency] = useState("all");
  const [minBudget, setMinBudget] = useState<number>(0);

  const filters = { category, location, urgency, minBudget };
  const chainId = useChainId() || 11142220;

  const {
    data: tasks,
    isLoading,
    hasMore,
    fetchNextPage,
  } = useTasks(chainId, filters);

  // 🌀 Infinite scroll when not filtered
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

  const getUrgencyColor = (urgency: UrgencyType) => {
    switch (urgency) {
      case "urgent":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = CATEGORIES.find((cat) => cat.value === category);
    return categoryData ? categoryData.icon : Search;
  };

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
            className="ml-4 bg-white/5 hover:bg-white/10 rounded-lg flex "
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
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Min budget..."
                    type="number"
                    value={minBudget || ""}
                    onChange={(e) => setMinBudget(Number(e.target.value))}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc.value} value={loc.value}>
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

        {/* Tasks grid */}
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <TaskSkeleton key={i} />)
        ) : tasks.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tasks.map((task: HireCoreTask, index: number) => {
              const CategoryIcon = getCategoryIcon(task.category);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="glass-effect border-white/20 hover:border-blue-500/50 transition-all duration-300 h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <CategoryIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-white text-lg">
                              {task.metadata.title}
                            </CardTitle>
                            <p className="text-gray-400 text-sm">
                              {task.location ?? "Unknown"}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={`${getUrgencyColor(task.urgency as UrgencyType)} border`}
                        >
                          {task.urgency}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                        {task.metadata.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30">
                          {task.budget}{" "}
                          <span className="core-token ml-1">CØRE</span>
                        </Badge>
                        <Link href={`/task/${task.id}`}>
                          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
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
