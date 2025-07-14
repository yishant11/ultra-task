"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";

export function LocationDisplay() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBackgroundTaskRunning, setIsBackgroundTaskRunning] =
    useState<boolean>(false);

  const getLocation = () => {
    setIsLoading(true);
    setError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (err) => {
          setError(err.message);
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  };

  const runBackgroundTask = () => {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      setIsBackgroundTaskRunning(true);
      requestIdleCallback(
        () => {
          // Simulate a low-priority task, e.g., re-fetching location or processing data
          console.log("Background task: Re-fetching location data...");
          getLocation(); // Re-fetch location as a background task
          setIsBackgroundTaskRunning(false);
        },
        { timeout: 2000 }
      ); // Give it 2 seconds to run before becoming urgent
    } else {
      setError(
        "requestIdleCallback is not supported by this browser. Falling back to direct update."
      );
      getLocation();
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Fetching location...</span>
        </div>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : location ? (
        <div className="space-y-2">
          <p>
            <span className="font-semibold text-[#00798c]">Latitude:</span>{" "}
            {location.latitude.toFixed(6)}
          </p>
          <p>
            <span className="font-semibold text-[#00798c]">Longitude:</span>{" "}
            {location.longitude.toFixed(6)}
          </p>
        </div>
      ) : (
        <p>Click the button to get your location.</p>
      )}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={getLocation} disabled={isLoading} className="bg-[#edae49] cursor-pointer">
          <MapPin className="mr-2 h-4 w-4" />
          {isLoading ? "Updating..." : "Get My Location"}
        </Button>
        <Button
          onClick={runBackgroundTask}
          disabled={isBackgroundTaskRunning || isLoading}
          variant="outline"
          className="bg-[#edae49] cursor-pointer border-0 py-4"
        >
          {isBackgroundTaskRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin " />
              Running Background Task...
            </>
          ) : (
            "Update Location  "
          )}
        </Button>
      </div>
      <p className="text-gray-500 text-sm text-muted-foreground">
        Uses Geolocation API and Background Tasks API (via
        `requestIdleCallback`).
      </p>
    </div>
  );
}
