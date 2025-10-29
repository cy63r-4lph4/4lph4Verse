"use client";

import { motion } from "framer-motion";
import { MapPin, Star, Flame, Hammer, ArrowLeft, Edit3 } from "lucide-react";
import Image from "next/image";
import { Button } from "@verse/ui/components/ui/button";
import { Badge } from "@verse/ui/components/ui/badge";
import { Card, CardContent } from "@verse/ui/components/ui/card";
import { useMemo, useState } from "react";
import { VerseProfile } from "@verse/sdk/types/verseProfile";

export default function WorkerProfileLayout({
  profile,
}: {
  profile: VerseProfile;
}) {
  const [expanded, setExpanded] = useState(false);
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 3,
      })),
    []
  );
  const worker = profile.personas?.hirecore?.roles.worker;
  if (!worker) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
        <p>This profile is private.</p>
      </div>
    );
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
      {/* ───────────────────── Hero Section ───────────────────── */}
      <div className="relative h-[22rem] overflow-hidden rounded-b-[3rem]">
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(16,185,129,0.2), transparent 60%), radial-gradient(circle at 80% 70%, rgba(5,150,105,0.25), transparent 70%)",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
        />

        {/* Glowing Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Floating Sparks */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[2px] bg-emerald-400/30 rounded-full"
            style={{ top: p.top, left: p.left }}
            animate={{ y: [0, -10, 0], opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
          />
        ))}

        {/* Info Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-center">
          <div className="w-32 h-32 rounded-full overflow-hidden border-[3px] border-emerald-400/60 shadow-[0_0_25px_rgba(16,185,129,0.5)]">
            <Image
              src={avatarSrc}
              alt="Avatar"
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
          <h1 className="mt-4 text-4xl font-bold text-white font-orbitron">
            {profile?.displayName}
          </h1>
          <p className="text-gray-400">@{profile?.handle}</p>
          <p className="flex items-center gap-2 text-sm text-gray-400 mt-1">
            <MapPin className="w-4 h-4 text-emerald-300" /> {profile?.location}
          </p>

          {/* Actions */}
          <div className="mt-4 flex gap-3">
            <Button
              variant="ghost"
              onClick={() => history.back()}
              className="text-gray-300 hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/30">
              <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* ───────────────────── Profile Body ───────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {/* Overview */}
          <Card className="bg-white/5 border border-white/10 hover:border-emerald-400/20 backdrop-blur-md transition-all">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-emerald-300 flex items-center gap-2">
                <Hammer className="w-5 h-5" /> The Forge
              </h2>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                {worker.bio}
              </p>
              <div className="mt-4 space-y-2 text-gray-300">
                <p>
                  🏆 Completed Tasks: <b>{worker.completedTasks}</b>
                </p>
                <p>
                  💰 Earnings: <b>{worker.earnings} CØRE</b>
                </p>
                <p>
                  ⭐ Rating: <b>{worker.rating}</b>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="bg-white/5 border border-white/10 hover:border-emerald-400/20 backdrop-blur-md transition-all">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-emerald-300 flex items-center gap-2">
                <Flame className="w-5 h-5" /> Skills Forge
              </h2>
              <div className="flex flex-wrap gap-2 mt-3">
                {worker.skills?.map((s) => (
                  <Badge
                    key={s}
                    className="bg-emerald-500/10 border-emerald-400/20 text-emerald-200 text-xs"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reputation */}
          <Card className="bg-white/5 border border-white/10 hover:border-emerald-400/20 backdrop-blur-md transition-all">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-emerald-300 flex items-center gap-2">
                <Star className="w-5 h-5" /> Reputation
              </h2>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden mt-3">
                <motion.div
                  className="h-2 bg-emerald-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${profile?.reputation}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <p className="text-right text-sm text-gray-400 mt-1">
                {profile?.reputation}%
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Job Applications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl text-white font-orbitron mb-5">
            Active Applications
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {worker.applications
              ?.slice(0, expanded ? worker.applications.length : 3)
              .map((job) => (
                <Card
                  key={job.id}
                  className="bg-white/5 border border-white/10 hover:border-emerald-400/20 backdrop-blur-md transition-all"
                >
                  <CardContent className="p-4">
                    <h3 className="text-white font-semibold">{job.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      Budget: {job.budget} CØRE
                    </p>
                    <Badge
                      className={`${
                        job.status === "completed"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : job.status === "accepted"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : job.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                      } border`}
                    >
                      {job.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
          </div>

          {worker.applications && worker.applications.length > 3 && (
            <div className="flex justify-center mt-6">
              <Button
                variant="ghost"
                onClick={() => setExpanded(!expanded)}
                className="text-emerald-300 hover:text-white hover:bg-emerald-500/10"
              >
                {expanded ? "Show Less" : "View More"}
              </Button>
            </div>
          )}
        </motion.div>

        {/* Activity Log */}
        <motion.div className="mt-20 space-y-3">
          <h2 className="text-xl text-white font-orbitron mb-4">
            Forge Activity
          </h2>
          {[
            "Completed ‘CØRE Integration UI’ with 5⭐ review",
            "Claimed 180 CØRE from ‘Vault Marketplace’ contract",
            "Applied to ‘LeaseVault Portal Design’",
          ].map((event, i) => (
            <motion.div
              key={i}
              className="glass-effect p-4 border-l-4 border-emerald-400/20 text-gray-300"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              {event}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
