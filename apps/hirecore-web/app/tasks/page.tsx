"use client";

import {
  MOCK_TASKS,
  CATEGORIES,
  LOCATIONS,
} from "apps/hirecore-web/utils/Constants";
import { useEffect, useState } from "react";
import { TaskDisplayType, UrgencyType } from "apps/hirecore-web/types/task";
import { Clock, Filter, MapPin, Search, Star } from "lucide-react";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "apps/hirecore-web/components/ui/card";
import { Input } from "apps/hirecore-web/components/ui/input";
import { Badge } from "apps/hirecore-web/components/ui/badge";
import Link from "next/link";
import { Button } from "apps/hirecore-web/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "apps/hirecore-web/components/ui/select";
import { TaskSkeleton } from "apps/hirecore-web/components/Skeleton";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [tasks, setTasks] = useState<TaskDisplayType[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const isFiltered =
    searchTerm.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedLocation !== "all";
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 6);
      setLoading(false);
    }, 5000); // simulate API delay
  };

  useEffect(() => {
    // Load tasks from localStorage or use mock data
    const savedTasks = localStorage.getItem("hirex_tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(MOCK_TASKS);
      localStorage.setItem("hirex_tasks", JSON.stringify(MOCK_TASKS));
    }
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || task.category === selectedCategory;
    const matchesLocation =
      selectedLocation === "all" ||
      task.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation;
  });
  useEffect(() => {
    if (!isFiltered) {
      const handleScroll = () => {
        if (
          window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200
        ) {
          loadMore();
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isFiltered]);
  // const displayedTasks = isFiltered
  //   ? filteredTasks
  //   : filteredTasks.slice(0, visibleCount);

  const [page, setPage] = useState(1);
  const pageSize = 4;

  // const paginatedTasks = filteredTasks.slice(
  //   (page - 1) * pageSize,
  //   page * pageSize
  // );

  const getUrgencyColor = (urgency: UrgencyType) => {
    switch (urgency) {
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
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = CATEGORIES.find((cat) => cat.value === category);
    return categoryData ? categoryData.icon : Search;
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-4">
                Find Tasks
              </h1>

              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Discover opportunities to earn{" "}
                <span className="core-token">CØRE</span> tokens by providing
                your skills and services
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className="ml-4 bg-white/5 hover:bg-white/10 rounded-lg flex "
              >
                <Filter className="w-5 h-5 text-blue-400" />
              </Button>
            </motion.div>

            {/* Search and Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="glass-effect rounded-xl p-6 mb-8 border border-white/20"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search Input */}
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20">
                      {CATEGORIES.map((category) => (
                        <SelectItem
                          key={category.value}
                          value={category.value}
                          className="text-white hover:bg-white/10"
                        >
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Location Filter */}
                  <Select
                    value={selectedLocation}
                    onValueChange={setSelectedLocation}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20">
                      {LOCATIONS.map((location) => (
                        <SelectItem
                          key={location.value}
                          value={location.value}
                          className="text-white hover:bg-white/10"
                        >
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}

            {/* Results Count */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <p className="text-gray-300">
                Found{" "}
                <span className="text-blue-400 font-semibold">
                  {filteredTasks.length}
                </span>{" "}
                tasks
              </p>
            </motion.div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTasks.map((task, index) => {
                const CategoryIcon = getCategoryIcon(task.category);

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="glass-effect border-white/20 hover:border-blue-500/50 transition-all duration-300 h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <CategoryIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-white text-lg">
                                {task.title}
                              </CardTitle>
                              <p className="text-gray-400 text-sm">
                                by {task.postedBy} • {task.postedTime}
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={`${getUrgencyColor(
                              task.urgency
                            )} border`}
                          >
                            {task.urgency}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-gray-300">{task.description}</p>

                        <div className="flex flex-wrap gap-2">
                          {task.skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-blue-400 border-blue-500/30"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2 text-gray-300">
                            <MapPin className="w-4 h-4 text-blue-400" />
                            <span>{task.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-300">
                            <Clock className="w-4 h-4 text-green-400" />
                            <span>{task.timeEstimate}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-white font-semibold">
                                {task.rating}
                              </span>
                              <span className="text-gray-400">
                                ({task.reviews})
                              </span>
                            </div>
                            <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30">
                              {task.budget}{" "}
                              <span className="core-token ml-1">CØRE</span>
                            </Badge>
                          </div>

                          <Link href={`/task/${task.id}`}>
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                              View Details
                            </Button>
                          </Link>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <span>
                            Service:{" "}
                            {task.serviceType === "on-site"
                              ? "On-site visit"
                              : "Workshop"}
                          </span>
                          {task.status && (
                            <Badge
                              className={`text-xs ${
                                task.status === "in-progress"
                                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                  : task.status === "completed"
                                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                                    : task.status === "cancelled"
                                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                                      : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              } border`}
                            >
                              {task.status}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
            {/* Skeleton loader */}
            {loading &&
              Array.from({ length: 2 }).map((_, i) => (
                <TaskSkeleton key={`skeleton-${i}`} />
              ))}

            {/* No Results */}
            {filteredTasks.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No tasks found
                </h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your search criteria or check back later for new
                  opportunities.
                </p>
                <Link href="/post">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Post a Task Instead
                  </Button>
                </Link>
              </motion.div>
            )}

            {isFiltered && (
              <div className="flex justify-center mt-8 gap-4">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-gray-300">Page {page}</span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setPage((p) =>
                      p < Math.ceil(filteredTasks.length / pageSize) ? p + 1 : p
                    )
                  }
                  disabled={page >= Math.ceil(filteredTasks.length / pageSize)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
