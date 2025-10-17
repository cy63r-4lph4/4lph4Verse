"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@verse/hirecore-web/components/ui/card";
import { Badge } from "@verse/hirecore-web/components/ui/badge";
import { MapPin, Clock, DollarSign, Home, Building } from "lucide-react";
import type { Task } from "./types";
import TaskAttachments from "./TaskAttachments"; // ✅ import

export default function TaskMain({ task }: { task: Task }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="glass-effect border-white/20">
        <CardContent className="space-y-6 p-6">
          {/* Description */}
          <section>
            <h3 className="text-white font-semibold mb-3">Task Description</h3>
            <p className="text-gray-300 leading-relaxed">{task.description}</p>
          </section>

          {/* Skills */}
          {task.skills && task.skills.length > 0 && (
            <section>
              <h3 className="text-white font-semibold mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {task.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="text-blue-400 border-blue-500/30"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Details Grid */}
          <section>
            <h3 className="text-white font-semibold mb-3">Task Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow
                icon={<MapPin className="w-5 h-5 text-blue-400" />}
                label="Location"
                value={task.location || "Not specified"}
              />
              <InfoRow
                icon={<Clock className="w-5 h-5 text-green-400" />}
                label="Time Estimate"
                value={task.timeEstimate || "Not specified"}
              />
              <InfoRow
                icon={<DollarSign className="w-5 h-5 text-yellow-400" />}
                label="Budget"
                value={
                  <span className="core-token font-bold">
                    {task.budget} CØRE
                  </span>
                }
              />
              <InfoRow
                icon={
                  task.serviceType === "on-site" ? (
                    <Home className="w-5 h-5 text-purple-400" />
                  ) : (
                    <Building className="w-5 h-5 text-purple-400" />
                  )
                }
                label="Service Type"
                value={
                  task.serviceType === "on-site"
                    ? "On-site visit"
                    : "Workshop service"
                }
              />
            </div>
          </section>

          {/* ✅ Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <section>
              <TaskAttachments attachments={task.attachments} />
            </section>
          )}

          {/* GPS */}
          {task.coordinates &&
            (task.coordinates.lat || task.coordinates.lng) && (
              <section>
                <h3 className="text-white font-semibold mb-3">GPS Location</h3>
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-400">
                    <MapPin className="w-4 h-4" />
                    <span className="font-mono text-sm">
                      {task.coordinates.lat}, {task.coordinates.lng}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mt-2">
                    Use these coordinates for precise navigation to the task
                    location.
                  </p>
                </div>
              </section>
            )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
      {icon}
      <div>
        <div className="text-white font-medium">{label}</div>
        <div className="text-gray-400 text-sm">{value}</div>
      </div>
    </div>
  );
}
