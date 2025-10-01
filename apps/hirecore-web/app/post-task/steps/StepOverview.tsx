"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@verse/hirecore-web/components/ui/card";
import { Input } from "@verse/hirecore-web/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@verse/hirecore-web/components/ui/select";
import { CATEGORIES, URGENCYlEVEL } from "@verse/hirecore-web/utils/Constants";
import { TaskFormData } from "@verse/hirecore-web/utils/Interfaces";
import { Home, Building, Laptop } from "lucide-react";

interface StepOverviewProps {
  formData: TaskFormData;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
}

export default function StepOverview({ formData, setFormData }: StepOverviewProps) {
  const handleChange = <K extends keyof TaskFormData>(field: K, value: TaskFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white text-xl">Step 1: Task Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-white font-medium mb-2">Task Title *</label>
          <Input
            placeholder="e.g., Fix Kitchen Electrical Outlet"
            value={formData.title}
            onChange={e => handleChange("title", e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-white font-medium mb-2">Category *</label>
          <Select value={formData.category} onValueChange={val => handleChange("category", val)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white data-[placeholder]:text-gray-400">
              <SelectValue placeholder="Select category"  />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              {CATEGORIES.map(c => (
                <SelectItem key={c.value} value={c.value} className="text-white hover:bg-white/10">
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-white font-medium mb-2">Urgency Level *</label>
          <Select value={formData.urgency} onValueChange={val => handleChange("urgency", val)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white data-[placeholder]:text-gray-400">
              <SelectValue placeholder="Select urgency" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              {URGENCYlEVEL.map(level => (
                <SelectItem key={level.value} value={level.value} className="text-white hover:bg-white/10">
                  <span className={level.color}>{level.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Service Type */}
        <div>
          <label className="block text-white font-medium mb-2">Service Type *</label>
          <Select value={formData.serviceType} onValueChange={val => handleChange("serviceType", val)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white data-[placeholder]:text-gray-400">
              <SelectValue placeholder="Choose service type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              <SelectItem value="on-site" className="text-white hover:bg-white/10">
                <div className="flex items-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>On-site (Worker comes to you)</span>
                </div>
              </SelectItem>
              <SelectItem value="workshop" className="text-white hover:bg-white/10">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>Workshop (You go to worker)</span>
                </div>
              </SelectItem>
              <SelectItem value="remote" className="text-white hover:bg-white/10">
                <div className="flex items-center space-x-2">
                  <Laptop className="w-4 h-4" />
                  <span>Remote (Online work)</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
