"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Briefcase,
  UserCog,
  MapPin
} from "lucide-react";
import Image from "next/image";
import { Button } from "@verse/hirecore-web/components/ui/button";
import { Badge } from "@verse/hirecore-web/components/ui/badge";
import { Card, CardContent } from "@verse/hirecore-web/components/ui/card";
import { VerseProfile } from "@verse/sdk/types/verseProfile";
import { WorkerApplication } from "@verse/hirecore-web/app/applications/utils/types";

// ────────────────────────────────────────────────────────────────
// Mock Data (replace with profile prop from SDK later)
// ────────────────────────────────────────────────────────────────
const mockProfile = {
  verseId: "verse_42220_5",
  displayName: "Cy63r_4lph4~🐉",
  handle: "cy63r_4lph4",
  avatar: "/placeholder-soul.png",
  banner:
    "https://omegasystemscorp.com/wp-content/uploads/2022/09/inner-banner.jpg",
  location: "Neo-Accra 🌆",
  wallet: "0xA1B2C3D4E5F60718293A4B5C6D7E8F9012345678" as `0x${string}`,
  reputation: 88,
  personas: {
    hirecore: {
      roles: {
        worker: {
          bio: "Forging the Verse — one contract, one build, one legend.",
          completedTasks: 19,
          rating: 4.9,
          earnings: 1340,
          skills: ["Smart Contracts", "UI/UX", "Next.js", "Blockchain Design"],
          applications: [
            {
              id: 1,
              title: "NFT Marketplace UI",
              status: "accepted",
              budget: 250,
            },
            {
              id: 2,
              title: "Gasless CØRE Integration",
              status: "pending",
              budget: 180,
            },
          ],
        },
        hirer: {
          bio: "Seeking brilliant builders for 4lph4 projects.",
          postedTasks: 5,
          totalSpent: 940,
          activeHires: 2,
        },
      },
    },
  },
};

// ────────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────────
export default function DualProfileLayout({ profile }: { profile: VerseProfile }) {
  const [active, setActive] = useState<"worker" | "hirer">("worker");
  const worker = profile.personas?.hirecore?.roles.worker;
  const hirer = profile.personas?.hirecore?.roles.hirer;
  const persona = active === "worker" ? worker : hirer;

  // Dynamic hue based on role
  const hue = active === "worker" ? "emerald" : "indigo";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen relative  text-gray-200 overflow-hidden mt-26`}
    >
      {/* ─────────────── Ambient Backlight Layer ─────────────── */}
      <motion.div
        className="fixed inset-0 -z-10"
        style={{
          background:
            active === "worker"
              ? "radial-gradient(circle at 30% 30%, rgba(16,185,129,0.08), transparent 70%), radial-gradient(circle at 80% 70%, rgba(34,197,94,0.06), transparent 60%)"
              : "radial-gradient(circle at 30% 30%, rgba(99,102,241,0.08), transparent 70%), radial-gradient(circle at 80% 70%, rgba(168,85,247,0.06), transparent 60%)",
        }}
        animate={{ opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* ─────────────── Hero Banner ─────────────── */}
      <div className="relative w-full h-[22rem] overflow-hidden rounded-b-[3rem]">
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              active === "worker"
                ? "radial-gradient(circle at 20% 30%, rgba(16,185,129,0.25), transparent 50%), radial-gradient(circle at 80% 70%, rgba(5,150,105,0.3), transparent 60%)"
                : "radial-gradient(circle at 20% 30%, rgba(99,102,241,0.25), transparent 50%), radial-gradient(circle at 80% 70%, rgba(168,85,247,0.3), transparent 60%)",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ duration: 18, repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Particles */}
        <motion.div className="absolute inset-0 opacity-40">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-[2px] h-[2px] rounded-full ${
                active === "worker" ? "bg-emerald-400/40" : "bg-indigo-400/40"
              }`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </motion.div>

        {/* Identity Info */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-center">
          <div
            className={`w-32 h-32 rounded-full overflow-hidden border-[3px] ${
              active === "worker"
                ? "border-emerald-400/60 shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                : "border-indigo-400/60 shadow-[0_0_25px_rgba(99,102,241,0.5)]"
            }`}
          >
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                width={128}
                height={128}
                alt="Avatar"
                className="object-cover"
              />
            ) : null}
          </div>
          <h1 className="mt-4 text-4xl font-bold text-white font-orbitron">
            {profile.displayName}
          </h1>
          <p className="text-gray-400">@{profile.handle}</p>
          <p className="flex items-center gap-2 text-sm text-gray-400 mt-1">
            <MapPin className="w-4 h-4 text-gray-400" /> {profile.location}
          </p>

          {/* Role Switch */}
          <div className="mt-5 flex gap-3 bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-2 py-1">
            <Button
              variant="ghost"
              onClick={() => setActive("worker")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                active === "worker"
                  ? "bg-emerald-500/20 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                  : "text-gray-400"
              }`}
            >
              <Briefcase className="w-4 h-4 mr-1" /> Worker
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActive("hirer")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                active === "hirer"
                  ? "bg-indigo-500/20 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                  : "text-gray-400"
              }`}
            >
              <UserCog className="w-4 h-4 mr-1" /> Client
            </Button>
          </div>
        </div>
      </div>

      {/* ─────────────── Profile Body ─────────────── */}
      <div className="max-w-7xl mx-auto px-6 mt-16 space-y-16">
        {/* Stats + Overview */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {/* Overview */}
          <Card className="bg-white/5 border border-white/10 backdrop-blur-md hover:border-white/20 transition-all">
            <CardContent className="p-6 space-y-3">
              <h2
                className={`text-lg font-semibold ${
                  active === "worker" ? "text-emerald-300" : "text-indigo-300"
                }`}
              >
                {active === "worker" ? "Verse Reputation" : "Trust Profile"}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                {persona?.bio}
              </p>

              <div className="flex flex-col gap-2 mt-4 text-gray-300">
               {active === "worker" && worker && (
  <>
    <p>🏆 Completed Tasks: <b>{worker.completedTasks}</b></p>
    <p>💰 Earnings: <b>{worker.earnings} CØRE</b></p>
    <p>⭐ Rating: <b>{worker.rating}</b></p>
  </>
)}

{active === "hirer" && hirer && (
  <>
    <p>📋 Posted Tasks: <b>{hirer.postedTasks}</b></p>
    <p>💳 Total Spent: <b>{hirer.totalSpent} CØRE</b></p>
    <p>🧩 Active Hires: <b>{hirer.activeHires}</b></p>
  </>
)}
              </div>
            </CardContent>
          </Card>

          {/* Skills / Highlights */}
          <Card className="bg-white/5 border border-white/10 hover:border-white/20 backdrop-blur-md transition-all">
            <CardContent className="p-6 space-y-3">
              <h2
                className={`text-lg font-semibold ${active === "worker" ? "text-emerald-300" : "text-indigo-300"}`}
              >
                {active === "worker" ? "Core Skills" : "Focus Areas"}
              </h2>
              <div className="flex flex-wrap gap-2">
                {(active === "worker" ? worker?.skills ?? [] : ["Leadership", "Project Vision"]).map((skill: string) => (
                  <Badge
                    key={skill}
                    className={`${
                      active === "worker"
                        ? "bg-emerald-500/10 border-emerald-400/20 text-emerald-200"
                        : "bg-indigo-500/10 border-indigo-400/20 text-indigo-200"
                    } text-xs`}
                  >
                    {skill}
                    </Badge>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Reputation Bar */}
          <Card className="bg-white/5 border border-white/10 hover:border-white/20 backdrop-blur-md transition-all">
            <CardContent className="p-6 space-y-3">
              <h2
                className={`text-lg font-semibold ${active === "worker" ? "text-emerald-300" : "text-indigo-300"}`}
              >
                Reputation Score
              </h2>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className={`h-2 ${active === "worker" ? "bg-emerald-400" : "bg-indigo-400"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${profile.reputation}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <p className="text-right text-sm text-gray-400">
                {profile.reputation}%
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Applications / Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl text-white font-semibold mb-5">
            {active === "worker" ? "Recent Applications" : "Active Tasks"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(active === "worker"
              ? worker?.applications ?? []
              : Array.from({ length: 3 })
            ).map((item: WorkerApplication, i: number) => (
              <Card
                key={i}
                className="bg-white/5 border border-white/10 hover:border-white/20 backdrop-blur-md transition-all"
              >
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-1">
                    {active === "worker" ? item.title : `Task #${i + 1}`}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {active === "worker"
                      ? `Budget: ${item.budget} CØRE`
                      : "Ongoing hire..."}
                  </p>
                  <Badge
                    className={`${
                      active === "worker"
                        ? item.status === "accepted"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : item.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
                    } border`}
                  >
                    {active === "worker" ? item.status : "in progress"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Verse Activity */}
        <motion.div className="mt-20 space-y-3">
          <h2 className="text-xl text-white font-orbitron mb-4">
            Echoes of the Verse
          </h2>
          {[
            "Completed ‘CØRE Contract Refactor’",
            "Received tip from @vault_lover (25 CØRE)",
            "Posted bounty ‘DragonVolt Energy’",
          ].map((activity, i) => (
            <motion.div
              key={i}
              className="glass-effect p-4 border-l-4 border-white/10 text-gray-300"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              {activity}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
