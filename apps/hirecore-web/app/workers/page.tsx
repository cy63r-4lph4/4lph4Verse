"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Search } from "lucide-react";
import { Input } from "@verse/hirecore-web/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@verse/hirecore-web/components/ui/select";
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
      setLoading(true);
      const params = new URLSearchParams(filters);
      const res = await fetch(`/api/workers?${params.toString()}`);
      const data = await res.json();
      setWorkers(data?.data || []);
      setLoading(false);
    })();
  }, [filters]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-white">Available Workers</h1>
          <div className="flex gap-3 items-center w-full sm:w-auto">
            <Input
              placeholder="Search by name or skill..."
              className="bg-white/5 border-white/10 text-white"
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
            />
            <Search className="text-gray-400" />
          </div>
        </div>

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
          <WorkerSkeleton count={6} />
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
