// hooks/useAuth.ts
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { subscribeToAuthChanges } from "../lib/authClient";

import { ApiClient } from "../lib/api-client";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAuthChanges(async (u) => {
      setUser(u);
      setLoading(false);

      if (u) {
        try {
          await ApiClient.syncUser(u);
        } catch (error) {
          console.error("Background sync failed:", error);
        }
      }
    });
    return () => unsub();
  }, []);

  return { user, loading };
}