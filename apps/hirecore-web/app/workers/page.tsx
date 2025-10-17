"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Search } from "lucide-react";
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
import { CATEGORIES, LOCATIONS } from "@verse/hirecore-web/utils/Constants";
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

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(filters);
        const res = await fetch(`/api/workers?${params.toString()}`);

        if (!res.ok) throw new Error("Failed to fetch workers");
        const data = await res.json();

        setWorkers(Array.isArray(data?.data) ? data.data : data);
      } catch (err) {
        console.error("❌ Worker fetch error:", err);
        setWorkers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [filters]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
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


        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <Select
            onValueChange={(v) => setFilters((f) => ({ ...f, category: v }))}
            value={filters.category}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10">
              <SelectItem value="all">All</SelectItem>
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
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10">
              <SelectItem value="all">All</SelectItem>
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
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
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
