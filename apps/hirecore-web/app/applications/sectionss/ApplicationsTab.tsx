"use client";

import { ClipboardList, Inbox } from "lucide-react";
import { Button } from "@verse/hirecore-web/components/ui/button";

export function ApplicationsTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: "applications" | "requests";
  setActiveTab: (tab: "applications" | "requests") => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        onClick={() => setActiveTab("applications")}
        className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full transition-all ${
          activeTab === "applications"
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
            : "bg-white/5 text-gray-400 hover:text-white"
        }`}
      >
        <ClipboardList className="w-4 h-4" /> Applications
      </Button>

      <Button
        variant="ghost"
        onClick={() => setActiveTab("requests")}
        className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full transition-all ${
          activeTab === "requests"
            ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg"
            : "bg-white/5 text-gray-400 hover:text-white"
        }`}
      >
        <Inbox className="w-4 h-4" /> Requests
      </Button>
    </div>
  );
}
