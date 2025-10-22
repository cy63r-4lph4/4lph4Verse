"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@verse/ui/components/ui/input";

export function ApplicationsHeader({
  activeTab,
  query,
  setQuery,
}: {
  activeTab: "applications" | "requests";
  query: string;
  setQuery: (v: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
    >
      <div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
          {activeTab === "applications" ? "My Applications" : "Service Requests"}
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mt-2" />
        <p className="text-gray-400 text-sm mt-2">
          {activeTab === "applications"
            ? "Track your submitted applications and their status."
            : "Respond to direct requests from clients."}
        </p>
      </div>

      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder={`Search ${activeTab}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 bg-white/5 border-white/10 text-gray-200 focus:border-blue-400 focus:ring-0"
        />
      </div>
    </motion.div>
  );
}
