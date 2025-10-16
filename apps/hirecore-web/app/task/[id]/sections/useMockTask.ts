"use client";
import { useEffect, useState } from "react";
import type { Task } from "./types";

const KEY = "hirex_tasks";

const SEED: Task[] = [
  {
    id: 1,
    title: "Fix electrical wiring in living room",
    description:
      "Lights flicker when turning on multiple appliances. Need an electrician to inspect and rewire if necessary.",
    postedBy: "You",
    postedTime: "2 hours ago",
    location: "Accra, Ghana",
    timeEstimate: "3-4 hours",
    budget: 250,
    serviceType: "on-site",
    urgency: "high",
    status: "open",
    skills: ["Electrical Repair", "Wiring", "Safety Certified"],
    rating: 4.8,
    reviews: 12,
    coordinates: { lat: 5.614818, lng: -0.205874 },
  },
  {
    id: 2,
    title: "Plumbing leak under kitchen sink",
    description:
      "Slow leak causing dampness. Need a plumber to replace piping and seal joints.",
    postedBy: "Sarah Mitchell",
    postedTime: "yesterday",
    location: "Tema, Ghana",
    timeEstimate: "2-3 hours",
    budget: 180,
    serviceType: "workshop",
    urgency: "urgent",
    status: "open",
    skills: ["Plumbing Repair", "Pipe Installation"],
    rating: 4.6,
    reviews: 8,
  },
];

export function useMockTask(id?: string) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    // Seed if empty
    const raw = localStorage.getItem(KEY);
    if (!raw) localStorage.setItem(KEY, JSON.stringify(SEED));

    const list: Task[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    const found = list.find((t) => String(t.id) === String(id)) || null;

    // Simulate async
    const t = setTimeout(() => {
      setTask(found);
      setLoading(false);
    }, 300);

    return () => clearTimeout(t);
  }, [id]);

  return { task, loading };
}