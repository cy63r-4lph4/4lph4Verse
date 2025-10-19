"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  MapPin,
  Briefcase,
  Banknote,
  ClipboardList,
  Star,
} from "lucide-react";
import { Button } from "@verse/hirecore-web/components/ui/button";
import { Progress } from "@verse/hirecore-web/components/ui/progress";
import { TabsContent } from "@verse/hirecore-web/components/ui/tabs";
import VerseTabs, { TabItem } from "@verse/hirecore-web/components/VerseTab";
import Image from "next/image";
import { ComponentType, useState } from "react";

interface ClientProfile extends Record<string, unknown> {
  displayName?: string;
  handle?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  reputation?: number;
  totalSpent?: number;
  postedTasks?: number;
  activeHires?: number;
  rating?: number;
}

export interface ClientProfileLayoutProps {
  profile: ClientProfile;
}

export default function ClientProfileLayout({
  profile,
}: ClientProfileLayoutProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // pull values from profile (with fallbacks)
  const displayName = profile?.displayName || "Unnamed User";
  const handle = profile?.handle || "unknown";
  const avatar = profile?.avatar || "/default-avatar.png";
  const location = profile?.location || "Earth Realm 🌍";
  const reputation = profile?.reputation ?? 72;
  const totalSpent = profile?.totalSpent ?? 0;
  const postedTasks = profile?.postedTasks ?? 0;
  const activeHires = profile?.activeHires ?? 0;
  const rating = profile?.rating ?? 0;

  const tabs: TabItem[] = [
    { value: "overview", label: "Overview" },
    { value: "tasks", label: "My Tasks" },
    { value: "payments", label: "Payments" },
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
          <Button
            variant="ghost"
            className="text-gray-300 hover:bg-white/10"
            onClick={() => history.back()}
          >
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
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-indigo-500/40 shadow-lg">
                <Image
                  src={
                    avatar.startsWith("ipfs://")
                      ? `https://${avatar.replace("ipfs://", "")}.ipfs.dweb.link`
                      : avatar
                  }
                  alt="User avatar"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
              <h1 className="text-3xl font-bold text-white font-orbitron mt-4">
                {displayName}
              </h1>
              <p className="text-gray-400">@{handle}</p>
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
                Trust score based on hiring history and activity.
              </p>
            </div>

            {/* Stats */}
            <div className="glass-effect p-6 rounded-2xl border border-white/20 space-y-4">
              <Stat
                label="Posted Tasks"
                value={postedTasks}
                icon={ClipboardList}
                color="text-emerald-400"
              />
              <Stat
                label="Active Hires"
                value={activeHires}
                icon={Briefcase}
                color="text-indigo-400"
              />
              <Stat
                label="Total Spent"
                value={`${totalSpent} CØRE`}
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
                {profile?.bio ? (
                  <p>{profile.bio}</p>
                ) : (
                  <p className="text-gray-400 italic">No bio provided yet.</p>
                )}
              </TabsContent>

              {/* Tasks */}
              <TabsContent
                value="tasks"
                className="mt-6 glass-effect p-6 rounded-2xl border border-white/20 text-gray-300"
              >
                Reuse My Tasks component here.
              </TabsContent>

              {/* Payments */}
              <TabsContent
                value="payments"
                className="mt-6 glass-effect p-6 rounded-2xl border border-white/20 text-gray-300"
              >
                Payment history here.
              </TabsContent>
            </VerseTabs>
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
        <Icon className={`w-4 h-4 ${color}`} />
        {label}
      </span>
      <span className="font-bold text-white">{value}</span>
    </div>
  );
}
