"use client";

import { ReactNode, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

// Module-level singleton — stable across re-renders and safe for SSR.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5 min: don't refetch on every tab focus / component mount
      staleTime: 1000 * 60 * 5,
      // 24 h: keep data in memory so offline navigation still works
      gcTime: 1000 * 60 * 60 * 24,
      retry: (failureCount, error: any) => {
        // Don't spin on 4xx client errors; retry up to 2× on network/5xx
        const status = error?.response?.status;
        if (status && status >= 400 && status < 500) return false;
        return failureCount < 2;
      },
    },
  },
});

/**
 * Wires up localStorage persistence after hydration.
 * Runs only in the browser — never during SSR — so prerendering is unaffected.
 */
function QueryPersistence() {
  useEffect(() => {
    const persister = createSyncStoragePersister({
      storage: window.localStorage,
      key: "arena-query-cache",
      throttleTime: 1000,
    });

    const [unsubscribe] = persistQueryClient({
      queryClient,
      persister,
      maxAge: 1000 * 60 * 60 * 24,     // 24 h — matches gcTime
      buster: process.env.NEXT_PUBLIC_BUILD_ID ?? "v1",
    });

    return unsubscribe;
  }, []);

  return null;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryPersistence />
      {children}
    </QueryClientProvider>
  );
}
