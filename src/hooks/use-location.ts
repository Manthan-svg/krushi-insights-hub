import { useState, useEffect } from "react";

interface LocationState {
  lat: number | null;
  lon: number | null;
  error: string | null;
  isLoading: boolean;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationState>({
    lat: null,
    lon: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        isLoading: false,
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          error: null,
          isLoading: false,
        });
      },
      (error) => {
        console.warn("Location error, defaulting to Pune:", error.message);
        setLocation((prev) => ({
          ...prev,
          lat: 18.5204, // Pune fallback
          lon: 73.8567, // Pune fallback
          error: error.message,
          isLoading: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);

  return location;
};
