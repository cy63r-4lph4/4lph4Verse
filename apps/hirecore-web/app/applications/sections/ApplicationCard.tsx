"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@verse/ui/components/ui/card";
import { TaskCard } from "@verse/hirecore-web/components/tasks/TaskCard";
import type { WorkerApplication } from "../utils/types";

export function ApplicationCard({
  task,
  index,
  onView,
}: {
  task: WorkerApplication;
  index: number;
  onView: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="overflow-hidden rounded-xl relative"
      onClick={onView}
    >
      <TaskCard task={task} index={index} />
      {typeof task.myBidAmount === "number" && (
        <div className="mt-3">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-2 px-3 text-xs text-gray-300 flex items-center justify-between">
              <span>Your bid</span>
              <span className="text-white font-medium">{task.myBidAmount} CØRE</span>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  );
}
