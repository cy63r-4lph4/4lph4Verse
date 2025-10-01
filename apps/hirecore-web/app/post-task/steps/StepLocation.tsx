"use client";

import { Button } from "@verse/hirecore-web/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@verse/hirecore-web/components/ui/card";
import { Input } from "@verse/hirecore-web/components/ui/input";
import { TaskFormData } from "@verse/hirecore-web/utils/Interfaces";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
import { useGeolocation } from "@verse/sdk/hooks/useGeolocation";
import { useEffect } from "react";

interface StepLocationProps {
  formData: TaskFormData;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
}

export default function StepLocation({
  formData,
  setFormData,
}: StepLocationProps) {
  const { coordinates, error, loading, detectLocation } = useGeolocation();

  const handleChange = <K extends keyof TaskFormData>(
    field: K,
    value: TaskFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDetect = () => {
    detectLocation();
  };

  useEffect(() => {
    if (coordinates) {
      setFormData((prev) => ({ ...prev, coordinates }));
      toast("📍 Location Detected", {
        description: `Lat: ${coordinates.lat}, Lng: ${coordinates.lng}`,
      });
    }
  }, [coordinates, setFormData]);

  useEffect(() => {
    if (error) {
      toast("❌ Location Error", { description: error });
    }
  }, [error]);

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white text-xl">Step 3: Location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Manual Location */}
        <div>
          <label className="block text-white font-medium mb-2">
            Location *
          </label>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter your location (e.g., Accra, Ghana)"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <Button
              type="button"
              onClick={handleDetect}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-3"
            >
              <MapPin className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-gray-400 text-xs mt-1">
            You can type an address or detect GPS automatically.
          </p>
        </div>

        {/* Show Detected Coordinates */}
        {formData.coordinates.lat && formData.coordinates.lng && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-gray-300">
            <p>
              <span className="font-semibold text-blue-400">Detected GPS:</span>{" "}
              {formData.coordinates.lat}, {formData.coordinates.lng}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
