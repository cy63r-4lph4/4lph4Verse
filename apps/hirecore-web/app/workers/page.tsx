"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Search, UserCog } from "lucide-react";
import { Input } from "@verse/hirecore-web/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@verse/hirecore-web/components/ui/select";
import { WorkerCard } from "@verse/hirecore-web/components/workers/WorkerCard";
import { WorkerSkeleton } from "@verse/hirecore-web/components/workers/Skeleton";
import {
  CATEGORIES,
  LOCATIONS,
  SERVICES,
} from "@verse/hirecore-web/utils/Constants";
import type { WorkerProfile } from "@verse/hirecore-web/utils/Interfaces";

export default function WorkersPage() {
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    location: "all",
    rating: "all",
    search: "",
  });

  // ---------------- Fetch Workers ----------------
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(filters);
        const res = await fetch(`/api/workers?${params.toString()}`);

        if (!res.ok) throw new Error("Failed to fetch workers");
        const data = await res.json();
        if (isMounted) setWorkers(Array.isArray(data?.data) ? data.data : data);
      } catch (err) {
        console.error("❌ Worker fetch error:", err);
        if (isMounted) setWorkers([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [filters]);

  // ---------------- UI ----------------
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
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              Available Workers
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mt-2"></div>
          </div>

          <div className="relative w-full sm:w-72">
            <Input
              placeholder="Search by name or skill..."
              className="bg-white/5 border-white/10 text-white pl-10"
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </motion.div>

        {/* ⚡ Quick Category Chips */}
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

          <Select
            onValueChange={(v) => setFilters((f) => ({ ...f, rating: v }))}
            value={filters.rating}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white w-full">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10">
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="4.5">4.5+</SelectItem>
              <SelectItem value="4.0">4.0+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Worker Grid */}
        {loading ? (
          <WorkerSkeleton count={9} />
        ) : workers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center text-gray-400 py-24 space-y-4"
          >
            {/* ✨ Illustration / Icon */}
            <div className="relative">
              <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-cyan-500 to-purple-600 opacity-30 rounded-full"></div>
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10">
                <UserCog className="w-8 h-8 text-purple-400" />
              </div>
            </div>

            {/* 💬 Text */}
            <h3 className="text-white text-lg font-semibold">
              No matching workers found
            </h3>
            <p className="text-gray-400 max-w-sm">
              Try adjusting your filters or exploring a different category.
              There might be new professionals joining soon.
            </p>

            {/* 🌟 CTA */}
            <button
              onClick={() =>
                setFilters({
                  category: "all",
                  location: "all",
                  rating: "all",
                  search: "",
                })
              }
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-md text-white font-medium hover:scale-105 transition-transform"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {workers.map((worker, i) => (
              <WorkerCard key={i} worker={worker} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------ */
/* 🎨 Horizontal Category Chips                    */
/* ------------------------------------------------ */
function QuickCategoryBar({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex gap-3 overflow-x-auto py-3 scrollbar-thin scrollbar-thumb-blue-500/40 scrollbar-track-transparent">
      {SERVICES.map(({ icon: Icon, name, color }) => {
        const isActive = active === name.toLowerCase();
        return (
          <motion.button
            key={name}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(isActive ? "all" : name.toLowerCase())}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 ${
              isActive
                ? `bg-gradient-to-r ${color} text-white shadow-lg shadow-${color.split(" ")[1]}/40`
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
