"use client";
import { motion } from "framer-motion";
import { ArrowLeft, BadgeInfo } from "lucide-react";
import { Button } from "@verse/ui/components/ui/button";
import { Card, CardHeader, CardTitle } from "@verse/ui/components/ui/card";
import type { Task } from "./types";


function urgencyClass(u?: Task["urgency"]) {
switch (u) {
case "urgent":
return "bg-red-500/20 text-red-400 border-red-500/30";
case "high":
return "bg-orange-500/20 text-orange-400 border-orange-500/30";
case "medium":
return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
case "low":
return "bg-green-500/20 text-green-400 border-green-500/30";
default:
return "bg-gray-500/20 text-gray-400 border-gray-500/30";
}
}


export default function TaskHeader({ task, onBack }: { task: Task; onBack: () => void }) {
return (
<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
<div className="mb-4">
<Button variant="ghost" onClick={onBack} className="text-gray-300 hover:text-white hover:bg-white/10">
<ArrowLeft className="w-4 h-4 mr-2" /> Back to Tasks
</Button>
</div>


<Card className="glass-effect border-white/20">
<CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
<div>
<CardTitle className="text-white text-2xl mb-2">{task.title}</CardTitle>
<div className="flex items-center gap-2 text-sm text-gray-400">
<span>Posted by {task.postedByProfile?.displayName || task.postedByProfile?.handle || "Unknown"}</span>
<span>•</span>
<span>{task.postedTime}</span>
</div>
</div>
<span className={`mt-3 md:mt-0 inline-flex items-center px-3 py-1 rounded-md border ${urgencyClass(task.urgency)}`}>
<BadgeInfo className="w-4 h-4 mr-1" /> {task.urgency || "unspecified"}
</span>
</CardHeader>
</Card>
</motion.div>
);
}