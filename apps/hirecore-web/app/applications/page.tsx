"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ApplicationsHeader, ApplicationsTabs, StatusFilterBar, ApplicationsGrid, EmptyState } from "./sections";
import { mockApplications, mockRequests } from "./utils/mockData";
import type { Status } from "@verse/hirecore-web/app/task/[id]/sections/types";

export default function ApplicationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"applications" | "requests">("applications");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");

  const source = activeTab === "applications" ? mockApplications : mockRequests;

  const filtered = useMemo(() => {
    return source
      .filter((t) => (statusFilter === "all" ? true : t.status === statusFilter))
      .filter((t) => (t.title || "").toLowerCase().includes(query.toLowerCase()));
  }, [source, query, statusFilter]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <ApplicationsHeader activeTab={activeTab} query={query} setQuery={setQuery} />
        <ApplicationsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <StatusFilterBar statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

        {filtered.length > 0 ? (
          <ApplicationsGrid activeTab={activeTab} tasks={filtered} onView={(id) => router.push(`/task/${id}`)} />
        ) : (
          <EmptyState tab={activeTab} />
        )}
      </div>
    </div>
  );
}
