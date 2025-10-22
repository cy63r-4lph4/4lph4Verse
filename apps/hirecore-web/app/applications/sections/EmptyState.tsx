"use client";

import { motion } from "framer-motion";
import { Button } from "@verse/ui/components/ui/button";
import { ClipboardList, Inbox } from "lucide-react";

export function EmptyState({ tab }: { tab: "applications" | "requests" }) {
  const Icon = tab === "applications" ? ClipboardList : Inbox;
  const title = tab === "applications" ? "No Applications Yet" : "No Requests Yet";
  const message =
    tab === "applications"
      ? "You haven't applied for any tasks yet. Explore open tasks and send your first application."
      : "No client has sent you a request yet. Keep your profile active and visible.";

  const cta =
    tab === "applications"
      ? { label: "Browse Tasks", href: "/tasks" }
      : { label: "Edit Profile", href: "/profile/edit" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center text-gray-400 py-24 space-y-4"
    >
      <div className="relative">
        <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 rounded-full"></div>
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10">
          <Icon className="w-8 h-8 text-blue-400" />
        </div>
      </div>

      <h3 className="text-white text-lg font-semibold">{title}</h3>
      <p className="text-gray-400 max-w-sm">{message}</p>

      <Button
        onClick={() => (window.location.href = cta.href)}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        {cta.label}
      </Button>
    </motion.div>
  );
}
