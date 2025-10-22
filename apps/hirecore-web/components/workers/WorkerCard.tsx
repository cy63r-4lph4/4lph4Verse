"use client";

import { motion } from "framer-motion";
import { Star, MapPin, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader } from "@verse/ui/components/ui/card";
import { Badge } from "@verse/ui/components/ui/badge";
import type { WorkerProfile } from "@verse/hirecore-web/utils/Interfaces";
import Image from "next/image";

export function WorkerCard({ worker, index }: { worker: WorkerProfile; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -5 }}
    >
      <Card className="glass-effect border border-white/10 hover:border-blue-500/40 transition-all h-full flex flex-col justify-between rounded-xl shadow-md hover:shadow-blue-500/10">
        <CardHeader className="flex items-center space-x-4">
          <Image
            src={worker.avatar || "/default-avatar.png"}
            alt={worker.name}
            className="w-12 h-12 rounded-full object-cover border border-white/10"
          />
          <div>
            <h3 className="text-white font-semibold">{worker.name}</h3>
            <p className="text-gray-400 text-sm">@{worker.handle}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-gray-300">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>{worker.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-purple-400" />
            <span>{worker.category}</span>
          </div>

          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white font-semibold">{worker.rating ?? "—"}</span>
            <span className="text-gray-400">({worker.reviews ?? 0})</span>
          </div>

          {worker.skills && worker.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {worker.skills.slice(0, 4).map((skill, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-blue-400 border-blue-500/30 text-xs"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
