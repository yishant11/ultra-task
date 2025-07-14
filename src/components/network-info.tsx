"use client";

import { useState, useEffect } from "react";
import { Wifi, WifiOff, Gauge, Cloud } from "lucide-react";

// Fix 1: Change the return type from `any` to `void`.
// Event handlers typically don't return anything.
interface NetworkInformation extends EventTarget {
  readonly type?: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
  readonly effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  readonly downlink?: number;
  readonly downlinkMax?: number;
  readonly rtt?: number;
  readonly saveData?: boolean;
  onchange?: ((this: NetworkInformation, ev: Event) => void) | null;
}

// Fix 2: Create a new interface that extends the base Navigator type.
// This avoids using `any` when accessing `navigator.connection`.
interface NavigatorWithConnection extends Navigator {
  connection: NetworkInformation;
}

export function NetworkInfo() {
  const [online, setOnline] = useState(true);
  const [connection, setConnection] = useState<NetworkInformation | null>(null);

  useEffect(() => {
    setOnline(navigator.onLine);

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (typeof navigator !== "undefined" && "connection" in navigator) {
      // Use the new, type-safe interface for the cast.
      const networkConnection = (navigator as NavigatorWithConnection).connection;
      setConnection(networkConnection);

      const updateConnectionStatus = () => {
        setConnection({ ...networkConnection });
      };

      networkConnection.addEventListener("change", updateConnectionStatus);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        networkConnection.removeEventListener("change", updateConnectionStatus);
      };
    }

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
      {!connection && online && (
        <p className="text-sm text-gray-500">
          Network Information API not supported by this browser.
        </p>
      )}
      <p className="text-sm text-gray-500">
        Uses Network Information API.
      </p>
    </div>
  );
}