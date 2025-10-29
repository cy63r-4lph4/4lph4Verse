"use client";

import { MapPin, Clock, Star, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@verse/ui/components/ui/card";
import { Badge } from "@verse/ui/components/ui/badge";
import { Button } from "@verse/ui/components/ui/button";
import { motion } from "motion/react";
import type { UrgencyType } from "@verse/hirecore-web/types/task";
import { CATEGORIES } from "@verse/hirecore-web/utils/Constants";
import { TaskCardProps } from "@verse/hirecore-web/utils/Interfaces";
import { useRouter } from "next/navigation";
import { useTaskStore } from "@verse/hirecore-web/store/useTaskStore";
import React from "react";

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

export function TaskCard({ task, index = 0 }: TaskCardProps) {
  const router = useRouter();
  const setTask = useTaskStore((s) => s.setTask);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -5 }}
    >
      <Card className="glass-effect border border-white/20 hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col justify-between rounded-none shadow-md hover:shadow-blue-500/10">
        <CardHeader>
          <div className="flex items-start justify-between">
            {/* Left: icon + title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center rounded-none">
                {React.createElement(getCategoryIcon(task.category!), {
                  className: "w-5 h-5 text-white",
                })}
              </div>
              <div>
                <CardTitle className="text-white text-lg font-semibold leading-tight ">
                  {task.title}
                </CardTitle>
                <p className="text-gray-400 text-sm m-0">
                  by{" "}
                  {task.postedByProfile?.displayName ||
                    task.postedByProfile?.handle ||
                    "Unknown"}{" "}
                  • {task.postedTime ?? "a few hours ago"}
                </p>
              </div>
            </div>

            {/* Urgency Badge */}
            <Badge
              className={`${getUrgencyColor(task.urgency as UrgencyType)} border text-xs px-2 py-0.5 rounded-lg`}
            >
              {task.urgency || "normal"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-grow justify-between space-y-4">
          {/* Description */}
          <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
            {task.description || "No description provided."}
          </p>

          {/* Skills */}
          {task.skills?.length ? (
            <div className="flex flex-wrap gap-2">
              {task.skills.map((skill: string, i: number) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-blue-400 border-blue-500/30"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          ) : null}

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-300">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>{task.location ?? "Unknown"}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 justify-end">
              <Clock className="w-4 h-4 text-green-400" />
              <span>{task.timeEstimate ?? "2-4 hrs"}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-white font-semibold">
                  {task.rating ?? 4.8}
                </span>
                <span className="text-gray-400">({task.reviews ?? 23})</span>
              </div>

              <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30">
                {task.budget} <span className="core-token ml-1">CØRE</span>
              </Badge>
            </div>

            <Button
              onClick={() => {
                setTask(String(task.id), task);
                router.push(`/task/${task.id}`);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all text-sm px-4 py-1.5 rounded-none"
            >
              View Details
            </Button>
          </div>

          {/* Service Type + Status */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              Service:{" "}
              {task.serviceType === "on-site" ? "On-site visit" : "Workshop"}
            </span>

            {task.status && (
              <Badge
                className={`text-xs ${
                  task.status === "assigned"
                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    : task.status === "completed"
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : task.status === "cancelled"
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                } border`}
              >
                {task.status}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
