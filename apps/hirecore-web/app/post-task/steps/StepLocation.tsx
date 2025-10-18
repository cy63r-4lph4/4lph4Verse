"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@verse/hirecore-web/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@verse/hirecore-web/components/ui/card";
import { Input } from "@verse/hirecore-web/components/ui/input";
import { MapPin, Loader2, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useGeolocation } from "@verse/sdk/hooks/useGeolocation";
import { TaskFormData } from "@verse/hirecore-web/utils/Interfaces";
import type { Map as LeafletMap } from "leaflet";


// 🗺️ Lazy-load react-leaflet for SSR safety
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
const RecenterOnChange = dynamic(() => import("./RecenterOnChange"), {
  ssr: false,
});

export default function StepLocation({
  formData,
  setFormDataAction,
}: {
  formData: TaskFormData;
  setFormDataAction: React.Dispatch<React.SetStateAction<TaskFormData>>;
}) {
  const { coordinates, error, loading, detectLocation } = useGeolocation();
  const [suggestions, setSuggestions] = useState<NominatimItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef<LeafletMap | null>(null);

  /* 🧩 Load default Leaflet marker assets (needed for Vite/Next builds) */
  useEffect(() => {
    if (typeof window === "undefined") return;
    (async () => {
      const L = await import("leaflet");
      delete (
        L.Icon.Default.prototype as unknown as {
          _getIconUrl?: string;
        }
      )._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    })();
  }, []);

  /* ----------------- Helpers ----------------- */
  const handleChange = <K extends keyof TaskFormData>(
    field: K,
    value: TaskFormData[K]
  ) => setFormDataAction((prev) => ({ ...prev, [field]: value }));

  const handleDetect = () => detectLocation();

  const shortAddress = (address: string): string => {
    const parts = address.split(",").map((p) => p.trim());
    if (parts.length <= 3) return address;
    const [first, ...rest] = parts;
    const country = parts.at(-1);
    const region =
      rest.find((p) => /Accra|Region|City|State|Province/i.test(p)) ||
      rest.at(0);
    return [first, region, country].filter(Boolean).join(", ");
  };

  /* ----------------- Effects ----------------- */
  useEffect(() => {
    if (!coordinates) return;
    (async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${coordinates.lat}&lon=${coordinates.lng}&format=json`
        );
        const data = await res.json();
        const address = shortAddress(data.display_name);
        setFormDataAction((prev) => ({
          ...prev,
          coordinates: { lat: coordinates.lat, lng: coordinates.lng },
          location: address,
        }));
        toast.success("📍 Location Detected", { description: address });
      } catch {
        toast.error("Failed to reverse geocode location");
      }
    })();
  }, [coordinates, setFormDataAction]);

  useEffect(() => {
    if (error) toast.error("❌ Location Error", { description: error });
  }, [error]);

  /* --- Search & Dedup --- */
  type NominatimItem = {
    display_name: string;
    lat: string;
    lon: string;
    importance?: number;
    place_rank?: number;
  };

  const distanceKm = (
    aLat: number,
    aLon: number,
    bLat: number,
    bLon: number
  ) => {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(bLat - aLat);
    const dLon = toRad(bLon - aLon);
    const la1 = toRad(aLat);
    const la2 = toRad(bLat);
    const sinDlat = Math.sin(dLat / 2);
    const sinDlon = Math.sin(dLon / 2);
    const h =
      sinDlat * sinDlat + Math.cos(la1) * Math.cos(la2) * sinDlon * sinDlon;
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
  };

  const dedupeByNameAndDistance = (
    items: NominatimItem[],
    kmThreshold = 0.35,
    maxPerLabel = 3
  ): NominatimItem[] => {
    const ranked = [...items].sort(
      (a, b) =>
        (b.importance ?? 0) - (a.importance ?? 0) ||
        (b.place_rank ?? 0) - (a.place_rank ?? 0)
    );

    const buckets = new Map<string, NominatimItem[]>();

    for (const it of ranked) {
      const key = shortAddress(it.display_name);
      const lat = parseFloat(it.lat);
      const lon = parseFloat(it.lon);
      const bucket = buckets.get(key) ?? [];

      const isNear = bucket.some((b) => {
        const d = distanceKm(lat, lon, parseFloat(b.lat), parseFloat(b.lon));
        return d < kmThreshold;
      });

      if (!isNear) {
        bucket.push(it);
        buckets.set(key, bucket);
      }
    }

    const result: NominatimItem[] = [];
    for (const [, arr] of buckets) {
      result.push(...arr.slice(0, maxPerLabel));
    }
    return result;
  };

  let abortCtrl: AbortController | null = null;

  async function searchLocation(query: string) {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    abortCtrl?.abort();
    abortCtrl = new AbortController();

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=12`,
        { signal: abortCtrl.signal }
      );
      const data: NominatimItem[] = await res.json();
      const deduped = dedupeByNameAndDistance(data, 0.35, 3);
      setSuggestions(deduped);
    } catch (e) {
      if (e instanceof Error && e.name !== "AbortError") console.error(e);
    } finally {
      setIsSearching(false);
    }
  }

  function selectSuggestion(suggestion: NominatimItem) {
    const address = shortAddress(suggestion.display_name);
    setFormDataAction((prev) => ({
      ...prev,
      location: address,
      coordinates: {
        lat: suggestion.lat,
        lng: suggestion.lon,
      },
    }));
    setSuggestions([]);
    toast.success("✅ Location Selected", { description: address });
  }

  /* ----------------- Render ----------------- */
  return (
    <Card className="glass-effect border border-white/10 rounded-2xl backdrop">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-semibold text-white">
          Step 3 · Location
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 relative">
        {/* 📍 Location Input */}
        <div className="relative">
          <label className="block text-white font-medium mb-2">
            Location <span className="text-red-400">*</span>
          </label>
          <div className="flex space-x-2">
            <div className="relative w-full">
              <Input
                placeholder="Type your location or detect..."
                value={formData.location}
                onChange={(e) => {
                  handleChange("location", e.target.value);
                  searchLocation(e.target.value);
                }}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              {isSearching && (
                <div className="absolute right-3 top-2">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
              )}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute mt-1 w-full bg-black/80 border border-white/10 
                 rounded-lg text-sm text-gray-200 backdrop-blur-xl 
                 z-[1000] max-h-60 overflow-y-auto shadow-xl"
                  >
                    {suggestions.map((s, i) => (
                      <li
                        key={i}
                        onClick={() => selectSuggestion(s)}
                        className="px-3 py-2 hover:bg-white/10 cursor-pointer border-b border-white/5"
                      >
                        <p className="text-white text-sm font-medium">
                          {shortAddress(s.display_name)}
                        </p>
                        <p className="text-gray-400 text-xs truncate">
                          {s.display_name}
                        </p>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <Button
              type="button"
              onClick={handleDetect}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-3"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-gray-400 text-xs mt-1">
            Type to search or detect automatically via GPS.
          </p>
        </div>

        {/* 🗺️ Map Preview */}
        <AnimatePresence>
          {formData.coordinates?.lat && formData.coordinates?.lng && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-xl border border-white/10"
            >
              <MapContainer
                center={[
                  parseFloat(formData.coordinates.lat),
                  parseFloat(formData.coordinates.lng),
                ]}
                zoom={15}
                scrollWheelZoom={false}
                zoomControl={false}
                className="h-56 w-full z-0"
                ref={(mapInstance) => {
                  if (mapInstance) mapRef.current = mapInstance;
                }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Marker
                  position={[
                    parseFloat(formData.coordinates.lat),
                    parseFloat(formData.coordinates.lng),
                  ]}
                />
                <RecenterOnChange
                  lat={parseFloat(formData.coordinates.lat)}
                  lng={parseFloat(formData.coordinates.lng)}
                />
              </MapContainer>

              {/* Zoom Buttons */}
              <div className="absolute bottom-3 right-3 flex flex-col bg-black/60 rounded-lg border border-white/10 backdrop-blur-md shadow-md z-[1000]">
                <button
                  onClick={() => mapRef.current?.zoomIn()}
                  className="p-2 hover:bg-white/10"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => mapRef.current?.zoomOut()}
                  className="p-2 hover:bg-white/10 border-t border-white/10"
                >
                  <Minus className="w-4 h-4 text-white" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 📍 Coordinates display */}
        {formData.coordinates?.lat && formData.coordinates?.lng && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-gray-300 flex justify-between items-center"
          >
            <span className="font-semibold text-blue-400">Detected GPS:</span>
            <span>
              {Number(formData.coordinates.lat).toFixed(5)},{" "}
              {Number(formData.coordinates.lng).toFixed(5)}
            </span>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
