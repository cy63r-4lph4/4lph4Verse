"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@verse/hirecore-web/components/ui/card";

export function WorkerSkeleton({ count = 6 }: { count?: number }) {
  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
        >
          <Card className="glass-effect border border-white/10 rounded-xl overflow-hidden h-full animate-pulse">
            <CardHeader className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-white/10 rounded" />
                <div className="h-3 w-16 bg-white/10 rounded" />
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Location */}
              <div className="h-3 w-1/2 bg-white/10 rounded" />
              {/* Category */}
              <div className="h-3 w-1/3 bg-white/10 rounded" />
              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="h-3 w-10 bg-white/10 rounded" />
                <div className="h-3 w-6 bg-white/10 rounded" />
              </div>
              {/* Skills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-5 w-14 bg-white/10 rounded-full"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
