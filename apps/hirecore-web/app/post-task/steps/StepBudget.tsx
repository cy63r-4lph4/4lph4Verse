"use client";

import { Input } from "@verse/hirecore-web/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@verse/hirecore-web/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@verse/hirecore-web/components/ui/card";
import { TaskFormData } from "@verse/hirecore-web/utils/Interfaces";
import { TIMEESTIMATE } from "@verse/hirecore-web/utils/Constants";

interface StepBudgetProps {
  formData: TaskFormData;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
}

export default function StepBudget({ formData, setFormData }: StepBudgetProps) {
  const handleChange = <K extends keyof TaskFormData>(field: K, value: TaskFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white text-xl">Step 4: Budget & Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Budget */}
        <div>
          <label className="block text-white font-medium mb-2">Budget (CØRE Tokens) *</label>
          <div className="relative">
            <Input
              type="number"
              placeholder="150"
              value={formData.budget}
              onChange={e => handleChange("budget", e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-16"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 core-token text-sm font-bold">
              CØRE
            </span>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-white font-medium mb-2">Duration (Expiry) *</label>
          <Select value={formData.duration} onValueChange={val => handleChange("duration", val)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              {[...Array(30)].map((_, i) => {
                const days = i + 1;
                return (
                  <SelectItem key={days} value={String(days * 86400)} className="text-white hover:bg-white/10">
                    {days} {days === 1 ? "day" : "days"}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <p className="text-gray-400 text-xs mt-1">Duration sets when the task post expires (1–30 days).</p>
        </div>

        {/* Time Estimate */}
        <div>
          <label className="block text-white font-medium mb-2">Estimated Time (for metadata)</label>
          <Select value={formData.timeEstimate} onValueChange={val => handleChange("timeEstimate", val)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select time estimate" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              {TIMEESTIMATE.map(time => (
                <SelectItem key={time.value} value={time.value} className="text-white hover:bg-white/10">
                  {time.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payment Token */}
        <div>
          <label className="block text-white font-medium mb-2">Payment Token *</label>
          <Select value={formData.paymentToken} onValueChange={val => handleChange("paymentToken", val)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              <SelectItem value="0xCoreTokenAddress" className="text-white hover:bg-white/10">
                CØRE Token
              </SelectItem>
              <SelectItem value="0xAnotherTokenAddress" className="text-white hover:bg-white/10">
                cUSD (stablecoin)
              </SelectItem>
              {/* 🔮 later: fetch allowedPaymentToken list from JobManager */}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
