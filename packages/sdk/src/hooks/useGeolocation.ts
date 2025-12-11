"use client";

import { useCallback, useState } from "react";
import { Coordinates } from "@verse/sdk/utils/interfaces";

export function useGeolocation() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Your browser doesn't support GPS location detection.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude.toString(),
          lng: position.coords.longitude.toString(),
        };
        setCoordinates(coords);
        setError(null);
        setLoading(false);
      },
      () => {
        setError("Unable to detect your location. Please enter it manually.");
        setLoading(false);
      }
    );
  }, []);

  return { coordinates, error, loading, detectLocation };
}
