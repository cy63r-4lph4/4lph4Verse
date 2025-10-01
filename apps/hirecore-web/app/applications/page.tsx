"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@verse/hirecore-web/components/ui/card";
import { Button } from "@verse/hirecore-web/components/ui/button";
import { Badge } from "@verse/hirecore-web/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@verse/hirecore-web/components/ui/tabs";
import { LayoutGrid, List, Briefcase, Clock, XCircle } from "lucide-react";

interface Application {
  id: number;
  taskTitle: string;
  category: string;
  clientName: string;
  budget: number;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  appliedAt: string;
}

const mockApplications: Application[] = [
  {
    id: 1,
    taskTitle: "Fix House Wiring",
    category: "Electrician",
    clientName: "John Doe",
    budget: 120,
    status: "pending",
    appliedAt: "2 days ago",
  },
  {
    id: 2,
    taskTitle: "Plumbing Renovation",
    category: "Plumber",
    clientName: "Sarah Smith",
    budget: 250,
    status: "accepted",
    appliedAt: "1 week ago",
  },
  {
    id: 3,
    taskTitle: "Tailor Suit Adjustments",
    category: "Seamstress",
    clientName: "Michael Johnson",
    budget: 80,
    status: "rejected",
    appliedAt: "3 weeks ago",
  },
];

export default function WorkerApplicationsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "accepted" | "rejected" | "withdrawn"
  >("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "withdrawn":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    }
  };

  const filteredApps = mockApplications.filter(
    (app) => statusFilter === "all" || app.status === statusFilter
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Centered Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-3">
            My Applications
          </h1>
          <p className="text-gray-300">
            Track all the tasks you&apos;ve applied for and their status
          </p>
        </motion.div>

        {/* Tabs + View Toggle */}
        <div className="flex items-center justify-between gap-4">
          <Tabs
            value={statusFilter}
            onValueChange={(val) =>
              setStatusFilter(val as Application["status"] | "all")
            }
            className="flex-1"
          >
            <TabsList className="w-full  grid-cols-5 bg-white/10 border border-white/20 rounded-none">
              <TabsTrigger
                value="all"
                className="text-white data-[state=active]:bg-blue-600 rounded-none"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="text-white data-[state=active]:bg-blue-600 rounded-none"
              >
                Pending
              </TabsTrigger>
              <TabsTrigger
                value="accepted"
                className="text-white data-[state=active]:bg-blue-600 rounded-none"
              >
                Accepted
              </TabsTrigger>
              <TabsTrigger
                value="rejected"
                className="text-white data-[state=active]:bg-blue-600 rounded-none"
              >
                Rejected
              </TabsTrigger>
              <TabsTrigger
                value="withdrawn"
                className="text-white data-[state=active]:bg-blue-600 rounded-none"
              >
                Withdrawn
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* View toggle */}
          <div className="flex gap-2 shrink-0 rounded-none">
            <Button
              size="icon"
              variant={view === "list" ? "default" : "outline"}
              onClick={() => setView("list")}
              className="rounded-none"
            >
              <List className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant={view === "grid" ? "default" : "outline"}
              onClick={() => setView("grid")}
              className="rounded-none"
            >
              <LayoutGrid className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Applications */}
        {filteredApps.length > 0 ? (
          view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="glass-effect border-white/20 hover:border-blue-500/50 h-full rounded-xl overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">
                        {app.taskTitle}
                      </CardTitle>
                      <p className="text-gray-400 text-sm">{app.category}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Briefcase className="w-4 h-4 text-blue-400" />
                        Client: {app.clientName}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Clock className="w-4 h-4 text-purple-400" />
                        Applied {app.appliedAt}
                      </div>
                      <div className="text-white font-bold">
                        {app.budget}{" "}
                        <span className="text-gray-400 text-xs">CØRE</span>
                      </div>
                      <Badge className={`${getStatusBadge(app.status)} border`}>
                        {app.status}
                      </Badge>

                      {app.status === "pending" && (
                        <div className="flex gap-2 pt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="hover:bg-white/10"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Withdraw
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApps.map((app) => (
                <Card
                  key={app.id}
                  className="glass-effect border-white/20 hover:border-blue-500/50"
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="text-white font-semibold">
                        {app.taskTitle}
                      </h3>
                      <p className="text-gray-400 text-sm">{app.category}</p>
                      <p className="text-gray-300 text-xs">
                        Client: {app.clientName} • Applied {app.appliedAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-white font-bold">
                          {app.budget} CØRE
                        </p>
                        <Badge
                          className={`${getStatusBadge(app.status)} border`}
                        >
                          {app.status}
                        </Badge>
                      </div>
                      {app.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-white/10"
                        >
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : (
          <Card className="glass-effect border-white/20">
            <CardContent className="text-center py-12">
              <h3 className="text-white font-semibold mb-2">
                No applications found
              </h3>
              <p className="text-gray-400">
                Try switching filters or apply for tasks.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
