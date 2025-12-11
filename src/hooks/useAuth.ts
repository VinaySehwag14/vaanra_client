// hooks/useAuth.ts
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { subscribeToAuthChanges, logOut } from "../lib/authClient";
import { ApiClient } from "../lib/api-client";
import { usePathname, useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsub = subscribeToAuthChanges(async (u) => {
      setLoading(true);
      setError(null);

      if (u) {
        // If on register page, DO NOT VERIFY.
        // We let the RegisterPage component handle the registration logic (either Google or Email).
        if (pathname === "/register") {
          setUser(u);
          setLoading(false);
          return;
        }

        try {
          // Verify user exists in database before allowing access
          await ApiClient.verifyAndSyncUser(u);
          setUser(u);
        } catch (error: any) {
          console.error("User verification failed:", error);

          // User doesn't exist in database
          if (error.message === "USER_NOT_FOUND") {
            setError("Your account is not registered in our system.");
            await logOut();
            setUser(null);
            router.push("/register");
          } else {
            setError("Failed to verify your account.");
            setUser(u); // Keep user logged in for other errors
          }
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });
    return () => unsub();
  }, [router, pathname]);

  return { user, loading, error };
}