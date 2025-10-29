"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit3,
  MapPin,
  ClipboardList,
  Briefcase,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@verse/ui/components/ui/button";
import { Card, CardContent } from "@verse/ui/components/ui/card";
import { Badge } from "@verse/ui/components/ui/badge";
import { useMemo, useState } from "react";
import { VerseProfile } from "@verse/sdk/types/verseProfile";

export default function ClientProfileLayout({
  profile,
}: {
  profile: VerseProfile;
}) {
  const [showAll, setShowAll] = useState(false);

  const hirer = profile?.personas?.hirecore?.roles.hirer;
  const particles = useMemo(() => {
    return Array.from({ length: 25 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 6 + Math.random() * 4,
    }));
  }, []);

  if (!hirer) {
    return <div>Client profile not found.</div>;
  }
  const avatarSrc =
    typeof profile.avatar === "string"
      ? profile.avatar
      : profile.avatar
        ? URL.createObjectURL(profile.avatar)
        : "/placeholder-soul.png";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen  text-gray-200 overflow-hidden mt-26"
    >
      {/* ───────────────── Banner ───────────────── */}
      <div className="relative w-full h-[20rem] overflow-hidden rounded-b-[3rem]">
        {/* Indigo Aura */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(99,102,241,0.2), transparent 60%), radial-gradient(circle at 80% 70%, rgba(168,85,247,0.25), transparent 70%)",
          }}
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 18, repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Floating Glow Particles */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[2px] bg-indigo-400/30 rounded-full"
            style={{
              top: p.top,
              left: p.left,
            }}
            animate={{ y: [0, -10, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: p.duration, repeat: Infinity }}
          />
        ))}

        {/* Identity */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 text-center bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="w-32 h-32 rounded-full overflow-hidden border-[3px] border-indigo-400/70 shadow-[0_0_25px_rgba(99,102,241,0.5)]">
            <Image
              src={avatarSrc}
              width={128}
              height={128}
              alt="Client avatar"
              className="object-cover"
            />
          </div>
          <h1 className="mt-4 text-4xl font-bold text-white font-orbitron">
            {profile.displayName}
          </h1>
          <p className="text-gray-400">@{profile.handle}</p>
          <p className="flex items-center gap-2 text-sm text-gray-400 mt-1">
            <MapPin className="w-4 h-4 text-indigo-300" /> {profile.location}
          </p>

          <div className="mt-4 flex gap-3">
            <Button
              variant="ghost"
              onClick={() => history.back()}
              className="text-gray-300 hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 hover:bg-indigo-500/30">
              <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* ───────────────── Profile Body ───────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        {/* Overview + Trust */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Trust Profile */}
          <Card className="bg-white/5 border border-white/10 hover:border-indigo-400/20 backdrop-blur-md transition-all">
            <CardContent className="p-6 space-y-3">
              <h2 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Trust Index
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                {hirer.bio}
              </p>

              <div className="mt-4">
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-2 bg-indigo-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${profile.reputation}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1 text-right">
                  {profile.reputation}%
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="bg-white/5 border border-white/10 hover:border-indigo-400/20 backdrop-blur-md transition-all">
            <CardContent className="p-6 space-y-3">
              <h2 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
                <ClipboardList className="w-5 h-5" /> Hiring Summary
              </h2>
              <div className="space-y-2 text-gray-300 mt-3">
                <p>
                  📋 Posted Tasks: <b>{hirer.postedTasks}</b>
                </p>
                <p>
                  ⚙️ Active Hires: <b>{hirer.activeHires}</b>
                </p>
                <p>
                  💰 Total Spent: <b>{hirer.totalSpent} CØRE</b>
                </p>
                <p>
                  ⭐ Rating: <b>{hirer.rating} / 5</b>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Team Affiliations */}
          <Card className="bg-white/5 border border-white/10 hover:border-indigo-400/20 backdrop-blur-md transition-all">
            <CardContent className="p-6 space-y-3">
              <h2 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
                <Briefcase className="w-5 h-5" /> Alliances
              </h2>
              <div className="flex flex-wrap gap-2">
                {hirer.teams?.map((team) => (
                  <Badge
                    key={team}
                    className="bg-indigo-500/10 border-indigo-400/20 text-indigo-200 text-xs"
                  >
                    {team}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ───────────────── Operations Deck ───────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-orbitron text-white">
            Active & Recent Tasks
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {hirer.recentTasks?.length ? (
              hirer.recentTasks
                .slice(0, showAll ? hirer.recentTasks.length : 3)
                .map((task) => (
                  <Card
                    key={task.id}
                    className="bg-white/5 border border-white/10 hover:border-indigo-400/20 backdrop-blur-md transition-all"
                  >
                    <CardContent className="p-4 space-y-2">
                      <h3 className="text-white font-semibold">{task.title}</h3>
                      <p className="text-sm text-gray-400">
                        Budget: {task.budget} CØRE
                      </p>
                      <Badge
                        className={`${
                          task.status === "completed"
                            ? "bg-green-500/20 text-green-400 border-green-400/20"
                            : task.status === "active"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-400/20"
                              : "bg-indigo-500/20 text-indigo-400 border-indigo-400/20"
                        } border text-xs`}
                      >
                        {task.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <p className="text-gray-400 col-span-full">
                No recent tasks to display.
              </p>
            )}
          </div>
          {hirer.recentTasks && hirer.recentTasks.length > 3 && (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                className="text-indigo-300 hover:text-white hover:bg-indigo-500/10"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Less" : "View More"}
              </Button>
            </div>
          )}
        </motion.div>

        {/* ───────────────── Reputation Timeline ───────────────── */}
        <motion.div className="mt-20 space-y-3">
          <h2 className="text-xl text-white font-orbitron mb-4">
            Verse Activity Log
          </h2>
          {[
            "Funded ‘DragonVolt Power Hub’ (200 CØRE)",
            "Closed task ‘CØRE Integration’ with 5⭐ review",
            "Invited @vault_lover to project ‘LoveChain’",
          ].map((log, i) => (
            <motion.div
              key={i}
              className="glass-effect p-4 border-l-4 border-indigo-400/30 text-gray-300"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              {log}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
