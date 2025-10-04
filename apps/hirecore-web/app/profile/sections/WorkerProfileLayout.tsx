"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Edit,
  MapPin,
  Briefcase,
  Banknote,
  ClipboardList,
  Star,
  Clock,
} from "lucide-react";
import { Button } from "@verse/hirecore-web/components/ui/button";
import { Progress } from "@verse/hirecore-web/components/ui/progress";
import { TabsContent } from "@verse/hirecore-web/components/ui/tabs";
import { Badge } from "@verse/hirecore-web/components/ui/badge";
import { Card, CardContent } from "@verse/hirecore-web/components/ui/card";
import { ComponentType, useState } from "react";
import VerseTabs, { TabItem } from "@verse/hirecore-web/components/VerseTab";

// 🧪 Mock Worker Data
const workerData = {
  name: "David Chen",
  handle: "@david_chef",
  location: "Accra, GH",
  reputation: 88,
  earnings: 4200,
  completedTasks: 47,
  pendingApplications: 5,
  rating: 4.9,
};

// 🧪 Mock Applications
const mockApplications = [
  {
    id: 1,
    title: "Catering for wedding reception",
    budget: 850,
    status: "accepted",
    appliedAt: "2 days ago",
  },
  {
    id: 2,
    title: "Private chef for dinner",
    budget: 500,
    status: "pending",
    appliedAt: "1 week ago",
  },
];

export default function WorkerProfileLayout() {
  const {
    name,
    handle,
    location,
    reputation,
    earnings,
    completedTasks,
    pendingApplications,
    rating,
  } = workerData;
  const [activeTab, setActiveTab] = useState("overview");

  const tabs: TabItem[] = [
    { value: "overview", label: "Overview" },
    { value: "applications", label: "Applications" },
    { value: "earnings", label: "Earnings" },
    { value: "activity", label: "Activity" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Actions */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" className="text-gray-300 hover:bg-white/10">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </Button>
          <Button className="bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-700 hover:to-emerald-600">
            <Edit className="w-5 h-5 mr-2" /> Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT COLUMN */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            {/* Profile Card */}
            <div className="text-center p-8 glass-effect rounded-2xl border border-white/20">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-indigo-500 flex items-center justify-center text-white mb-4 shadow-lg">
                <User className="w-16 h-16" />
              </div>
              <h1 className="text-3xl font-bold text-white font-orbitron">
                {name}
              </h1>
              <p className="text-gray-400">{handle}</p>
              <div className="mt-3 flex items-center justify-center gap-1 text-gray-300 text-sm">
                <MapPin className="w-4 h-4" />
                {location}
              </div>
            </div>

            {/* Reputation */}
            <div className="glass-effect p-6 rounded-2xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Verse Reputation
              </h3>
              <div className="flex items-center gap-4">
                <Progress value={reputation} className="w-full" />
                <span className="text-indigo-400 font-bold">{reputation}%</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Your performance score based on task history & reviews.
              </p>
            </div>

            {/* Stats */}
            <div className="glass-effect p-6 rounded-2xl border border-white/20 space-y-4">
              <Stat
                label="Completed Tasks"
                value={completedTasks}
                icon={ClipboardList}
                color="text-emerald-400"
              />
              <Stat
                label="Pending Applications"
                value={pendingApplications}
                icon={Briefcase}
                color="text-indigo-400"
              />
              <Stat
                label="Total Earnings"
                value={`${earnings} CØRE`}
                icon={Banknote}
                color="text-yellow-400"
              />
              <Stat
                label="Rating"
                value={`${rating} / 5`}
                icon={Star}
                color="text-indigo-400"
              />
            </div>
          </motion.div>

          {/* RIGHT COLUMN */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <VerseTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            >
              {/* Overview */}
              <TabsContent
                value="overview"
                className="mt-6 glass-effect p-6 rounded-2xl border border-white/20 text-gray-300"
              >
                Welcome back,{" "}
                <span className="text-indigo-400 font-semibold">{name}</span> 👋
                This is your worker overview.
              </TabsContent>

              {/* Applications */}
              <TabsContent value="applications" className="mt-6 space-y-4">
                {mockApplications.length > 0 ? (
                  mockApplications.map((app) => (
                    <Card
                      key={app.id}
                      className="glass-effect border-white/20 hover:border-blue-500/50 transition"
                    >
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <h3 className="text-white font-semibold">
                            {app.title}
                          </h3>
                          <p className="text-gray-400 text-sm flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Applied{" "}
                            {app.appliedAt}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white">
                            {app.budget} CØRE
                          </div>
                          <Badge
                            className={`${
                              app.status === "accepted"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            } border mt-2`}
                          >
                            {app.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="glass-effect p-6 text-center text-gray-400 border border-white/20 rounded-2xl">
                    No applications found.
                  </div>
                )}
              </TabsContent>

              {/* Earnings */}
              <TabsContent
                value="earnings"
                className="mt-6 glass-effect p-6 rounded-2xl border border-white/20 text-gray-300"
              >
                Earnings breakdown coming soon 💰
              </TabsContent>

              {/* Activity */}
              <TabsContent
                value="activity"
                className="mt-6 glass-effect p-6 rounded-2xl border border-white/20 text-gray-300"
              >
                Recent activity log coming soon 📝
              </TabsContent>
            </VerseTabs>{" "}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
interface StatProps {
  label: string;
  value: string | number;
  color: string;
  icon: ComponentType<{ className?: string }>;
}
function Stat({ label, value, icon: Icon, color }: StatProps) {
  return (
    <div className="flex justify-between text-gray-300">
      <span className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${color}`} /> {label}
      </span>
      <span className="font-bold text-white">{value}</span>
    </div>
  );
}
