"use client";

import { motion } from "framer-motion";
import { ApplicationCard } from "./ApplicationCard";
import { RequestCard } from "./RequestCard";
import type { WorkerApplication, ClientRequest } from "../utils/types";

export function ApplicationsGrid({
  activeTab,
  tasks,
  onView,
}: {
  activeTab: "applications" | "requests";
  tasks: (WorkerApplication | ClientRequest)[];
  onView: (id: number) => void;
}) {
  return (
    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
      {tasks.map((task, i) =>
        activeTab === "applications" ? (
          <ApplicationCard
            key={task.id}
            task={task as WorkerApplication}
            index={i}
            onView={() => onView(task.id)}
          />
        ) : (
          <RequestCard
            key={task.id}
            task={task as ClientRequest}
            index={i}
            onAccept={() => console.log("✅ accept", task.id)}
            onReject={() => console.log("❌ reject", task.id)}
            onView={() => onView(task.id)}
          />
        )
      )}
    </motion.div>
  );
}
