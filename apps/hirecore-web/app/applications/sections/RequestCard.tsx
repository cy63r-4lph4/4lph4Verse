"use client";

import { motion } from "framer-motion";
import { Button } from "@verse/hirecore-web/components/ui/button";
import { Card, CardContent } from "@verse/hirecore-web/components/ui/card";
import { TaskCard } from "@verse/hirecore-web/components/tasks/TaskCard";
import { CheckCircle, XCircle } from "lucide-react";
import type { ClientRequest } from "../utils/types";

export function RequestCard({
  task,
  index,
  onAccept,
  onReject,
  onView,
}: {
  task: ClientRequest;
  index: number;
  onAccept: () => void;
  onReject: () => void;
  onView: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="overflow-hidden rounded-xl"
    >
      <div className="space-y-3">
        <TaskCard task={task} index={index} />

        {task.requestNote && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-3 px-4 text-sm text-gray-300">
              <span className="text-gray-400">Client note:</span> {task.requestNote}
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onAccept}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
            >
              <CheckCircle className="w-4 h-4" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onReject}
              className="border-red-500/40 text-red-400 hover:bg-red-500/10 flex items-center gap-1"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </Button>
          </div>

          <Button
            size="sm"
            onClick={onView}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            View Task
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
