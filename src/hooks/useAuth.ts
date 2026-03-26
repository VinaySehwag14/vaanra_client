import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { subscribeToAuthChanges, logOut } from "../lib/authClient";
import { ApiClient } from "../lib/api-client";
import { usePathname, useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<any | null>(null); // Full user object from database
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsub = subscribeToAuthChanges(async (firebaseUser) => {
      setLoading(true);
      setError(null);

      if (firebaseUser) {
        try {
          // Verify user or auto-create in the database
          const response = await ApiClient.verifyOrCreate(firebaseUser);
          if (response.success && response.user) {
            setUser(firebaseUser);
            setDbUser(response.user);
          } else {
            throw new Error("Failed to retrieve user data");
          }
        } catch (error: any) {
          console.error("User verification failed:", error);
          setError("Failed to verify your account.");
          // We don't log them out immediately on failure, allowing retry attempts if needed.
          setUser(firebaseUser); 
          setDbUser(null);
        }
      } else {
        setUser(null);
        setDbUser(null);
      }

      setLoading(false);
    });
    return () => unsub();
  }, [router, pathname]);

  return { user, dbUser, loading, error };
}