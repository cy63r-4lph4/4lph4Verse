"use client";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  DollarSign,
  Home,
  Building,
} from "lucide-react";
import type { Task } from "./types";
import TaskAttachments from "./TaskAttachments";
import { Attachment } from "@verse/hirecore-web/utils/Interfaces";
import {Badge} from "@verse/ui/components/ui/badge"
import { Card, CardContent } from "@verse/ui/components/ui/card";
export default function TaskMain({
  task,
  onPreviewAttachment,
}: {
  task: Task;
  onPreviewAttachment: (attachment: Attachment) => void;
}) {

  const handleOpenGoogleMaps = () => {
    if (!task.coordinates) return;
    const { lat, lng } = task.coordinates;
    window.open(
      `https://www.google.com/maps?q=${lat},${lng}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleOpenOSM = () => {
    if (!task.coordinates) return;
    const { lat, lng } = task.coordinates;
    window.open(
      `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

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

          {/* Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <section>
              <TaskAttachments
                attachments={task.attachments}
                onPreview={onPreviewAttachment}
              />
            </section>
          )}

          {/* 🧭 GPS Location (Interactive) */}
          {task.coordinates &&
            (task.coordinates.lat || task.coordinates.lng) && (
              <section>
                <h3 className="text-white font-semibold mb-3">GPS Location</h3>
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center space-x-2 text-blue-400">
                      <MapPin className="w-4 h-4" />
                      <span className="font-mono text-sm">
                        {task.coordinates.lat}, {task.coordinates.lng}
                      </span>
                    </div>

                    {/* ✨ Better-looking buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleOpenGoogleMaps}
                        className="px-3 py-1.5 text-xs font-medium rounded-full
                bg-gradient-to-r from-blue-600 to-indigo-500
                text-white hover:from-blue-700 hover:to-indigo-600
                shadow-[0_0_10px_rgba(59,130,246,0.4)] transition-all duration-200"
                      >
                        Google Maps
                      </button>

                      <button
                        onClick={handleOpenOSM}
                        className="px-3 py-1.5 text-xs font-medium rounded-full
                bg-gradient-to-r from-purple-600 to-pink-500
                text-white hover:from-purple-700 hover:to-pink-600
                shadow-[0_0_10px_rgba(168,85,247,0.4)] transition-all duration-200"
                      >
                        OpenStreetMap
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm">
                    Tap a provider to open navigation, or preview the
                    coordinates on your map app.
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
