"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@verse/hirecore-web/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@verse/hirecore-web/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@verse/hirecore-web/components/ui/card";
import { TaskFormData } from "@verse/hirecore-web/utils/Interfaces";
import { TIMEESTIMATE } from "@verse/hirecore-web/utils/Constants";

interface StepBudgetProps {
  formData: TaskFormData;
  setFormDataAction: React.Dispatch<React.SetStateAction<TaskFormData>>;
}

export default function StepBudget({
  formData,
  setFormDataAction,
}: StepBudgetProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = <K extends keyof TaskFormData>(
    field: K,
    value: TaskFormData[K]
  ) => {
    setFormDataAction((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field as string]: "" }));
  };

  useEffect(() => {
    if (!formData.duration) {
      setFormDataAction((prev) => ({ ...prev, duration: String(3 * 86400) }));
    }
  }, [formData.duration, setFormDataAction]);

  // example conversion rate; replace with live oracle later
  const usdEstimate = useMemo(() => {
    const rate = 0.82; // 1 CORE ≈ $0.82
    return formData.budget
      ? (Number(formData.budget) * rate).toFixed(2)
      : "0.00";
  }, [formData.budget]);

  return (
    <Card className="glass-effect border border-white/10 rounded-2xl backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-semibold text-white">
          Step 4 · Budget & Timeline
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* --- Budget --- */}
        <div className="space-y-2">
          <label className="block text-white font-medium">
            Budget (CØRE Tokens) <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Input
              type="number"
              min={1}
              placeholder="150"
              value={formData.budget}
              onChange={(e) => handleChange("budget", e.target.value)}
              className={`bg-white/10 border ${
                errors.budget ? "border-red-500" : "border-white/20"
              } text-white placeholder:text-gray-400 pr-20`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-sm text-emerald-300">
              CØRE
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <p>≈ ${usdEstimate} USD</p>
            <p>Min 1 CØRE</p>
          </div>
          {errors.budget && (
            <p className="text-red-400 text-xs">{errors.budget}</p>
          )}
        </div>

        {/* --- Duration --- */}
        <div className="space-y-2">
          <label className="block text-white font-medium">
            Duration (Expiry) <span className="text-red-400">*</span>
          </label>
          <Select
            value={formData.duration}
            onValueChange={(val) => handleChange("duration", val)}
          >
            <SelectTrigger
              className={`bg-white/10 border ${
                errors.duration ? "border-red-500" : "border-white/20"
              } text-white `}
            >
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent className="bg-black/80 border border-white/20 backdrop-blur-xl">
              {[...Array(30)].map((_, i) => {
                const days = i + 1;
                return (
                  <SelectItem
                    key={days}
                    value={String(days * 86400)}
                    className="text-white hover:bg-white/10"
                  >
                    {days} {days === 1 ? "day" : "days"}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {errors.duration && (
            <p className="text-red-400 text-xs">{errors.duration}</p>
          )}
          <p className="text-gray-400 text-xs">
            Determines how long your task stays visible (1 - 30 days).
          </p>
        </div>

        {/* --- Time Estimate (optional) --- */}
        <div className="space-y-2">
          <label className="block text-white font-medium">
            Estimated Time (for metadata)
          </label>
          <Select
            value={formData.timeEstimate}
            onValueChange={(val) => handleChange("timeEstimate", val)}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white  data-[placeholder]:text-gray-400">
              <SelectValue placeholder="Select time estimate" />
            </SelectTrigger>
            <SelectContent className="bg-black/80 border border-white/20 backdrop-blur-xl">
              {TIMEESTIMATE.map((time) => (
                <SelectItem
                  key={time.value}
                  value={time.value}
                  className="text-white hover:bg-white/10"
                >
                  {time.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* --- Payment Token --- */}
        {/* <div className="space-y-2">
          <label className="block text-white font-medium">
            Payment Token <span className="text-red-400">*</span>
          </label>
          <Select
            value={formData.paymentToken}
            onValueChange={val => handleChange("paymentToken", val)}
          >
            <SelectTrigger
              className={`bg-white/10 border ${
                errors.paymentToken ? "border-red-500" : "border-white/20"
              } text-white`}
            >
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent className="bg-black/80 border border-white/20 backdrop-blur-xl">
              <SelectItem value="0xCoreTokenAddress" className="text-white hover:bg-white/10">
                CØRE Token
              </SelectItem>
              <SelectItem value="0xAnotherTokenAddress" className="text-white hover:bg-white/10">
                cUSD (Stablecoin)
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.paymentToken && (
            <p className="text-red-400 text-xs">{errors.paymentToken}</p>
          )}
        </div> */}
      </CardContent>
    </Card>
  );
}
