import React, { createContext, useContext, useState, useEffect } from "react";
import { setupOfflineSync } from "@/lib/api";

interface OfflineContextType {
  isOnline: boolean;
  syncStatus: "idle" | "syncing" | "synced" | "error";
  syncData: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "synced" | "error"
  >("idle");
  const offlineSync = setupOfflineSync();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Auto-sync when coming back online
    const autoSync = async () => {
      if (isOnline) {
        await syncData();
      }
    };

    autoSync();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOnline]);

  const syncData = async () => {
    if (!isOnline) return;

    try {
      setSyncStatus("syncing");
      await offlineSync.syncWhenOnline();
      setSyncStatus("synced");
    } catch (error) {
      console.error("Sync error:", error);
      setSyncStatus("error");
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        syncStatus,
        syncData,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);

  if (context === undefined) {
    throw new Error("useOffline must be used within an OfflineProvider");
  }

  return context;
}
