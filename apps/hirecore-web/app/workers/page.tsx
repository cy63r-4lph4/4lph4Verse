"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@verse/hirecore-web/components/ui/card";
import { Input } from "@verse/hirecore-web/components/ui/input";
import { Button } from "@verse/hirecore-web/components/ui/button";
import { Slider } from "@verse/hirecore-web/components/ui/slider";
import { Search, Filter, Star, Users } from "lucide-react";
import WorkerProfileCard from "@verse/hirecore-web/components/WorkerProfileCard";

interface Worker {
  id: number;
  name: string;
  profession: string;
  reputation: number;
  reviews: number;
  location: string;
  experience: string;
  completedTasks: number;
  responseTime: string;
  hourlyRate: number;
  bio: string;
  skills: string[];
  category: string;
  availability: string;
}

const mockWorkers: Worker[] = [
  {
    id: 1,
    name: "Alex Johnson",
    profession: "Professional Electrician",
    reputation: 4.9,
    reviews: 156,
    location: "Accra, GH",
    experience: "8+ years",
    completedTasks: 234,
    responseTime: "< 1 hour",
    hourlyRate: 85,
    bio: "Certified electrician specializing in residential and commercial electrical work. Available for emergency repairs.",
    skills: ["Electrical Repair", "Wiring", "Safety Certified"],
    category: "electrician",
    availability: "Available Now",
  },
  {
    id: 2,
    name: "Maria Garcia",
    profession: "Master Plumber",
    reputation: 4.8,
    reviews: 203,
    location: "Tema, GH",
    experience: "10+ years",
    completedTasks: 312,
    responseTime: "< 30 min",
    hourlyRate: 95,
    bio: "Licensed plumber with expertise in both residential and commercial systems.",
    skills: ["Pipe Installation", "Drain Cleaning"],
    category: "plumber",
    availability: "Available Today",
  },
  {
    id: 3,
    name: "Sarah Williams",
    profession: "Seamstress & Tailor",
    reputation: 4.9,
    reviews: 76,
    location: "Kumasi, GH",
    experience: "12+ years",
    completedTasks: 203,
    responseTime: "< 4 hours",
    hourlyRate: 65,
    bio: "Expert seamstress specializing in alterations, custom clothing, and repairs.",
    skills: ["Alterations", "Custom Tailoring"],
    category: "seamstress",
    availability: "Available Tomorrow",
  },
];

const categories = [
  { id: "all", label: "All Workers" },
  { id: "electrician", label: "Electricians" },
  { id: "plumber", label: "Plumbers" },
  { id: "seamstress", label: "Seamstresses" },
];

export default function WorkersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minRating, setMinRating] = useState(0);

  const filteredWorkers = useMemo(() => {
    return mockWorkers.filter((worker) => {
      const matchesSearch =
        worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "all" || worker.category === selectedCategory;

      const matchesRating = worker.reputation >= minRating;

      return matchesSearch && matchesCategory && matchesRating;
    });
  }, [searchTerm, selectedCategory, minRating]);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-4">
            Find Skilled Workers
          </h1>
          <p className="text-lg text-gray-300">
            Browse available talent and hire with CØRE
          </p>
        </motion.div>

        {/* Search & Filters */}
        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Search & Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, profession, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-500/50"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <Button
                  key={c.id}
                  variant={selectedCategory === c.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(c.id)}
                  className={
                    selectedCategory === c.id
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-transparent border-gray-600/50 text-gray-300 hover:bg-white/10"
                  }
                >
                  {c.label}
                </Button>
              ))}
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-2 flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" /> Minimum Rating:{" "}
                {minRating}★
              </label>
              <Slider
                defaultValue={[0]}
                max={5}
                step={0.5}
                value={[minRating]}
                onValueChange={(val) => setMinRating(val[0])}
              />
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>{filteredWorkers.length} workers found</span>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span>Sorted by reputation</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers
            .sort((a, b) => b.reputation - a.reputation)
            .map((worker) => (
              <motion.div
                key={worker.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center"
              >
                <WorkerProfileCard
                  worker={worker}
                  onViewProfile={(id) => console.log("View profile:", id)}
                  onContact={(id) => console.log("Contact worker:", id)}
                />
              </motion.div>
            ))}
        </div>

        {/* Empty State */}
        {filteredWorkers.length === 0 && (
          <Card className="glass-effect border-white/20">
            <CardContent className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No workers found</h3>
              <p className="text-gray-400 mb-4">
                Try adjusting your search terms or category filter.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setMinRating(0);
                }}
                variant="outline"
                className="neon-border bg-transparent hover:bg-white/10"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
