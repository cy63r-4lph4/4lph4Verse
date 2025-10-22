"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@verse/ui/components/ui/card";
import { Input } from "@verse/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@verse/ui/components/ui/select";
import { CATEGORIES, URGENCYLEVEL } from "@verse/hirecore-web/utils/Constants";
import { TaskFormData } from "@verse/hirecore-web/utils/Interfaces";
import { Home, Building, Laptop } from "lucide-react";

interface StepOverviewProps {
  formData: TaskFormData;
  setFormDataAction: React.Dispatch<React.SetStateAction<TaskFormData>>;
}

export default function StepOverview({
  formData,
  setFormDataAction,
}: StepOverviewProps) {
  const handleChange = <K extends keyof TaskFormData>(
    field: K,
    value: TaskFormData[K]
  ) => {
    setFormDataAction((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="glass-effect border border-white/10 rounded-2xl backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-semibold text-white">
          Step 1 · Task Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* --- Task Title --- */}
        <div className="space-y-2">
          <label className="block text-white font-medium">
            Task Title <span className="text-red-400">*</span>
          </label>
          <Input
            placeholder="e.g., Fix Kitchen Electrical Outlet"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-xl"
          />
          <p className="text-gray-400 text-xs">
            Choose a short, clear title that describes the task.
          </p>
        </div>

        {/* --- Category --- */}
        <div className="space-y-2">
          <label className="block text-white font-medium">
            Category <span className="text-red-400">*</span>
          </label>
          <Select
            value={formData.category}
            onValueChange={(val) => handleChange("category", val)}
          >
            <SelectTrigger className="bg-white/10 border border-white/20 text-white data-[placeholder]:text-gray-400 rounded-xl">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20 backdrop-blur-xl">
              {CATEGORIES.map((c) => (
                <SelectItem
                  key={c.value}
                  value={c.value}
                  className="text-white hover:bg-white/10"
                >
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-gray-400 text-xs">
            Helps workers find your task faster.
          </p>
        </div>

        {/* --- Urgency --- */}
        <div className="space-y-2">
          <label className="block text-white font-medium">
            Urgency Level <span className="text-red-400">*</span>
          </label>
          <Select
            value={formData.urgency}
            onValueChange={(val) => handleChange("urgency", val)}
          >
            <SelectTrigger className="bg-white/10 border border-white/20 text-white data-[placeholder]:text-gray-400 rounded-xl">
              <SelectValue placeholder="Select urgency" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20 backdrop-blur-xl">
              {URGENCYLEVEL.map((level) => (
                <SelectItem
                  key={level.value}
                  value={level.value}
                  className="text-white hover:bg-white/10"
                >
                  <span className={level.color}>{level.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-gray-400 text-xs">
            Choose how soon you want the task completed.
          </p>
        </div>

        {/* --- Service Type --- */}
        <div className="space-y-2">
          <label className="block text-white font-medium">
            Service Type <span className="text-red-400">*</span>
          </label>
          <Select
            value={formData.serviceType}
            onValueChange={(val) => handleChange("serviceType", val)}
          >
            <SelectTrigger className="bg-white/10 border border-white/20 text-white data-[placeholder]:text-gray-400 rounded-xl">
              <SelectValue placeholder="Choose service type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20 backdrop-blur-xl">
              <SelectItem
                value="on-site"
                className="text-white hover:bg-white/10"
              >
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-emerald-400" />
                  <span>On-site (Worker comes to you)</span>
                </div>
              </SelectItem>
              <SelectItem
                value="workshop"
                className="text-white hover:bg-white/10"
              >
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-indigo-400" />
                  <span>Workshop (You go to worker)</span>
                </div>
              </SelectItem>
              <SelectItem
                value="remote"
                className="text-white hover:bg-white/10"
              >
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-purple-400" />
                  <span>Remote (Online work)</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-gray-400 text-xs">
            Choose where the work will be done.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
