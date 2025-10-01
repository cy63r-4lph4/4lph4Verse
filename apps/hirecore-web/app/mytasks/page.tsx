"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@verse/hirecore-web/components/ui/card";
import { Badge } from "@verse/hirecore-web/components/ui/badge";
import { Button } from "@verse/hirecore-web/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@verse/hirecore-web/components/ui/tabs";
import {
  Plus,
  Clock,
  MapPin,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";

interface Task {
  id: number;
  title: string;
  budget: number;
  location: string;
  postedAt: string;
  status: "open" | "in-progress" | "completed" | "cancelled";
}

const mockTasks: Task[] = [
  {
    id: 1,
    title: "Fix kitchen electrical outlet",
    budget: 120,
    location: "Accra, GH",
    postedAt: "2 days ago",
    status: "open",
  },
  {
    id: 2,
    title: "Plumbing work for bathroom",
    budget: 200,
    location: "Tema, GH",
    postedAt: "1 week ago",
    status: "in-progress",
  },
  {
    id: 3,
    title: "Sew custom outfit for event",
    budget: 80,
    location: "Kumasi, GH",
    postedAt: "3 weeks ago",
    status: "completed",
  },
];

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredTasks = useMemo(() => {
    if (activeTab === "all") return mockTasks;
    return mockTasks.filter((t) => t.status === activeTab);
  }, [activeTab]);

  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "open":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "in-progress":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-3">
            My Tasks
          </h1>
          <p className="text-gray-300">
            Manage all your posted tasks and track their progress
          </p>
        </motion.div>

        {/* Tabs + View Toggle */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Tabs List stretched full width */}
            <TabsList className="flex-1  grid-cols-5 bg-white/10 border border-white/20  rounded-none">
              <TabsTrigger
                value="all"
                className="text-white data-[state=active]:bg-blue-600 rounded-none"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="open"
                className="text-white data-[state=active]:bg-blue-600 rounded-none"
              >
                Open
              </TabsTrigger>
              <TabsTrigger
                value="in-progress"
                className="text-white data-[state=active]:bg-blue-600 rounded-none"
              >
                In Progress
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="text-white data-[state=active]:bg-blue-600 rounded-none"
              >
                Completed
              </TabsTrigger>
              <TabsTrigger
                value="cancelled"
                className="text-white data-[state=active]:bg-blue-600 rounded-none"
              >
                Cancelled
              </TabsTrigger>
            </TabsList>

            {/* View Toggle */}
            <div className="flex gap-2 shrink-0 ">
              <Button
                size="icon"
                variant={viewMode === "grid" ? "default" : "outline"}
                onClick={() => setViewMode("grid")}
                className="rounded-none"
              >
                <LayoutGrid className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                className="rounded-none"
              >
                <ListIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
          {/* Tab Content */}
          <TabsContent value={activeTab} className="mt-6">
            {filteredTasks.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={`glass-effect border-white/20 hover:border-blue-500/50 transition-all ${
                        viewMode === "list" ? "w-full" : "h-full"
                      }`}
                    >
                      <CardContent
                        className={`${
                          viewMode === "list"
                            ? "flex items-center justify-between py-4"
                            : "space-y-4 py-6"
                        }`}
                      >
                        {/* Left Info */}
                        <div className={viewMode === "list" ? "flex-1" : ""}>
                          <h4 className="text-white font-semibold">
                            {task.title}
                          </h4>
                          <p className="text-gray-400 text-sm flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Posted {task.postedAt}
                            <MapPin className="w-4 h-4 ml-3" /> {task.location}
                          </p>
                        </div>

                        {/* Right Info */}
                        <div
                          className={
                            viewMode === "list"
                              ? "flex items-center gap-4"
                              : "flex flex-col items-end gap-3"
                          }
                        >
                          <Badge
                            className={`${getStatusBadge(task.status)} border`}
                          >
                            {task.status}
                          </Badge>
                          <div className="core-token font-semibold">
                            {task.budget} CØRE
                          </div>
                          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            Manage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="glass-effect border-white/20">
                <CardContent className="text-center py-12">
                  <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">
                    No tasks yet
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Start by posting your first task and hire skilled workers.
                  </p>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Post a Task
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
