import {
  Baby,
  Box,
  Car,
  ChefHat,
  Clock,
  Dog,
  GraduationCap,
  Hammer,
  Leaf,
  Lightbulb,
  MapPin,
  Paintbrush,
  Scissors,
  Search,
  Shield,
  Wrench,
  Zap,
} from "lucide-react";

/* -------------------------------------------- */
/* SERVICES CHIPS (used on home or explore page)*/
/* -------------------------------------------- */
export const SERVICES = [
  { icon: Wrench, name: "Electricians", color: "from-yellow-500 to-orange-500" },
  { icon: Paintbrush, name: "Plumbers", color: "from-blue-500 to-cyan-500" },
  { icon: Car, name: "Drivers", color: "from-green-500 to-emerald-500" },
  { icon: ChefHat, name: "Cooks", color: "from-red-500 to-pink-500" },
  { icon: Scissors, name: "Seamstress", color: "from-purple-500 to-violet-500" },
  { icon: Lightbulb, name: "Cleaners", color: "from-indigo-500 to-blue-500" },
  { icon: Hammer, name: "Handyman", color: "from-orange-500 to-red-500" },
  { icon: Leaf, name: "Gardeners", color: "from-lime-500 to-green-500" },
  { icon: Dog, name: "Pet Sitters", color: "from-amber-500 to-yellow-500" },
  { icon: GraduationCap, name: "Tutors", color: "from-cyan-500 to-sky-500" },
  { icon: Baby, name: "Babysitters", color: "from-pink-500 to-rose-500" },
  { icon: Box, name: "Movers", color: "from-slate-500 to-gray-500" },
];

/* -------------------------------------------- */
/* PLATFORM FEATURES                            */
/* -------------------------------------------- */
export const FEATURES = [
  {
    icon: MapPin,
    title: "GPS Location Tracking",
    description: "Find tasks and workers near you with precise GPS integration",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Choose between on-site visits or workshop appointments",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Safe transactions using CØRE cryptocurrency tokens",
  },
  {
    icon: Zap,
    title: "Instant Matching",
    description: "AI-powered matching system for quick task completion",
  },
];

/* -------------------------------------------- */
/* CATEGORIES (used for filters & metadata)     */
/* -------------------------------------------- */
export const CATEGORIES = [
  { value: "all", label: "All Categories", icon: Search },
  { value: "electrician", label: "Electricians", icon: Wrench },
  { value: "plumber", label: "Plumbers", icon: Paintbrush },
  { value: "driver", label: "Drivers", icon: Car },
  { value: "cook", label: "Cooks", icon: ChefHat },
  { value: "seamstress", label: "Seamstress", icon: Scissors },
  { value: "cleaner", label: "Cleaners", icon: Lightbulb },
  { value: "handyman", label: "Handyman", icon: Hammer },
  { value: "gardener", label: "Gardeners", icon: Leaf },
];

/* -------------------------------------------- */
/* LOCATIONS (demo or map-based options)        */
/* -------------------------------------------- */
export const LOCATIONS = [
  { value: "all", label: "All Locations" },
  { value: "accra", label: "Accra" },
  { value: "kumasi", label: "Kumasi" },
  { value: "cape-coast", label: "Cape Coast" },
  { value: "tema", label: "Tema" },
  { value: "takoradi", label: "Takoradi" },
];

/* -------------------------------------------- */
/* URGENCY LEVELS                               */
/* -------------------------------------------- */
export const URGENCYLEVEL = [
  { value: "low", label: "Low Priority", color: "text-green-400" },
  { value: "medium", label: "Medium Priority", color: "text-yellow-400" },
  { value: "high", label: "High Priority", color: "text-orange-400" },
  { value: "urgent", label: "Urgent", color: "text-red-400" },
];

/* -------------------------------------------- */
/* TIME ESTIMATES                               */
/* -------------------------------------------- */
export const TIMEESTIMATE = [
  { value: "1-2 hours", label: "1-2 hours" },
  { value: "2-3 hours", label: "2-3 hours" },
  { value: "3-4 hours", label: "3-4 hours" },
  { value: "4-6 hours", label: "4-6 hours" },
  { value: "1 day", label: "1 day" },
  { value: "2-3 days", label: "2-3 days" },
  { value: "1 week", label: "1 week" },
];
