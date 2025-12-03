// hooks/useAuth.ts
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { subscribeToAuthChanges } from "../lib/authClient";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAuthChanges((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { user, loading };
}