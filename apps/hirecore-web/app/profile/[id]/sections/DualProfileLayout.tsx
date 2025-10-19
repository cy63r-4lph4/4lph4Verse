"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  UserCog,
  Briefcase,
  ArrowLeft,
  Settings2,
} from "lucide-react";
import { Button } from "@verse/hirecore-web/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@verse/hirecore-web/components/ui/tabs";
import ClientProfileLayout from "./ClientProfileLayout";
import WorkerProfileLayout from "./WorkerProfileLayout";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
interface DualProfileLayoutProps {
  profile: any; // You can type this to your VerseProfile type later
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export default function DualProfileLayout({ profile }: DualProfileLayoutProps) {
  const [activeTab, setActiveTab] = useState<"worker" | "client">("worker");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            className="text-gray-300 hover:bg-white/10"
            onClick={() => history.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </Button>

          <Button className="bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-700 hover:to-emerald-600">
            <Settings2 className="w-5 h-5 mr-2" /> Edit Mode
          </Button>
        </div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-effect rounded-2xl border border-white/20 p-4"
        >
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)}>
            <TabsList className="flex justify-center mb-6">
              <TabsTrigger
                value="worker"
                className={`flex items-center gap-2 text-sm font-semibold ${
                  activeTab === "worker" ? "text-emerald-400" : "text-gray-400"
                }`}
              >
                <Briefcase className="w-4 h-4" /> Worker Profile
              </TabsTrigger>
              <TabsTrigger
                value="client"
                className={`flex items-center gap-2 text-sm font-semibold ${
                  activeTab === "client" ? "text-indigo-400" : "text-gray-400"
                }`}
              >
                <UserCog className="w-4 h-4" /> Client Profile
              </TabsTrigger>
            </TabsList>

            {/* Worker Section */}
            <TabsContent value="worker">
              <motion.div
                key="worker"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <WorkerProfileLayout profile={profile.workerData || profile} />
              </motion.div>
            </TabsContent>

            {/* Client Section */}
            <TabsContent value="client">
              <motion.div
                key="client"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <ClientProfileLayout profile={profile.clientData || profile} />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
}
