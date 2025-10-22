"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@verse/ui/components/ui/card";
import { Badge } from "@verse/ui/components/ui/badge";
import { Button } from "@verse/ui/components/ui/button";
import { Star, MapPin, Award, User, MessageCircle, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface WorkerProfileCardProps {
  worker: {
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
    availability: string;
  };
  onViewProfile: (id: number) => void;
  onContact: (id: number) => void;
}

export default function WorkerProfileCard({
  worker,
  onViewProfile,
  onContact,
}: WorkerProfileCardProps) {
  const getReputationColor = (reputation: number) => {
    if (reputation >= 4.5) return "text-green-400";
    if (reputation >= 4.0) return "text-blue-400";
    if (reputation >= 3.5) return "text-yellow-400";
    return "text-red-400";
  };

  const getReputationBadge = (reputation: number) => {
    if (reputation >= 4.8)
      return {
        label: "Elite",
        color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      };
    if (reputation >= 4.5)
      return {
        label: "Expert",
        color: "bg-green-500/20 text-green-400 border-green-500/30",
      };
    if (reputation >= 4.0)
      return {
        label: "Professional",
        color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      };
    if (reputation >= 3.5)
      return {
        label: "Skilled",
        color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      };
    return {
      label: "Beginner",
      color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };
  };

  const reputationBadge = getReputationBadge(worker.reputation);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="flex"
    >
      <Card className="glass-effect border-white/20 hover:border-blue-500/50 transition-all duration-300 h-full w-full max-w-sm flex flex-col justify-between rounded-xl overflow-hidden">
        {/* Header */}
        <CardHeader className="flex flex-col items-start gap-3">
          <div className="flex items-start justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">
                  {worker.name}
                </CardTitle>
                <p className="text-gray-400 text-sm">{worker.profession}</p>
              </div>
            </div>
            <Badge className={`${reputationBadge.color} border`}>
              {reputationBadge.label}
            </Badge>
          </div>

          {/* Reputation */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span
              className={`font-semibold ${getReputationColor(worker.reputation)}`}
            >
              {worker.reputation}
            </span>
            <span className="text-gray-400 text-xs">
              ({worker.reviews} reviews)
            </span>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="flex flex-col justify-between flex-1 space-y-4">
          <p className="text-gray-300 text-sm line-clamp-3">{worker.bio}</p>

          <div className="flex flex-wrap gap-2">
            {worker.skills.slice(0, 3).map((skill) => (
              <Badge
                key={skill}
                className="bg-white/5 border-white/10 text-xs text-blue-300"
              >
                {skill}
              </Badge>
            ))}
            {worker.skills.length > 3 && (
              <Badge className="bg-white/5 border-white/10 text-xs text-gray-400">
                +{worker.skills.length - 3} more
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 text-blue-400" /> {worker.location}
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-4 text-yellow-400" /> {worker.completedTasks}{" "}
              tasks
            </div>
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
            <div className="text-center">
              <span className="text-lg font-bold text-white flex items-center gap-1">
                {worker.hourlyRate}
                <span className="text-xs text-gray-400"> CØRE/hr</span>
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => onViewProfile(worker.id)}
                variant="outline"
                size="sm"
                className="neon-border bg-transparent hover:bg-white/10"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button
                onClick={() => onContact(worker.id)}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Contact
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
