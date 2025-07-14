"use client";

import { useState, useEffect } from "react";
import { Wifi, WifiOff, Gauge, Cloud } from "lucide-react";

export function NetworkInfo() {
  const [online, setOnline] = useState(true);
  const [connection, setConnection] = useState<NetworkInformation | null>(null);

  useEffect(() => {
    setOnline(navigator.onLine);
    if (typeof navigator !== "undefined" && "connection" in navigator) {
      const networkConnection = (navigator as any)
        .connection as NetworkInformation;
      setConnection(networkConnection);

      const updateConnectionStatus = () => {
        setConnection(networkConnection);
      };

      networkConnection.addEventListener("change", updateConnectionStatus);
      return () => {
        networkConnection.removeEventListener("change", updateConnectionStatus);
      };
    }

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        {online ? (
          <Wifi className="h-5 w-5 text-green-500" />
        ) : (
          <WifiOff className="h-5 w-5 text-red-500" />
        )}
        <p className="font-semibold text-[#00798c]">Status: {online ? "Online" : "Offline"}</p>
      </div>
      {connection && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Cloud className="h-4 w-4" />
            <p>
              <span className="font-semibold">Type:</span>{" "}
              {connection.type || "N/A"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Gauge className="h-4 w-4" />
            <p>
              <span className="font-semibold">Effective Type:</span>{" "}
              {connection.effectiveType || "N/A"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Gauge className="h-4 w-4" />
            <p>
              <span className="font-semibold">Downlink (Mbps):</span>{" "}
              {connection.downlink || "N/A"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Gauge className="h-4 w-4" />
            <p>
              <span className="font-semibold">Round-trip Time (ms):</span>{" "}
              {connection.rtt || "N/A"}
            </p>
          </div>
        </div>
      )}
      {!connection && (
        <p className="text-muted-foreground text-sm text-gray-500">
          Network Information API not fully supported by this browser.
        </p>
      )}
      <p className="text-sm text-muted-foreground text-gray-500">
        Uses Network Information API.
      </p>
    </div>
  );
}
