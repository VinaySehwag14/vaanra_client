"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isMagicLink, signInWithMagicLink } from "@/lib/authClient";
import { Loader2, MailCheck, AlertCircle } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    const completeSignIn = async () => {
      try {
        if (isMagicLink(window.location.href)) {
          let email = window.localStorage.getItem("emailForSignIn");
          
          if (!email) {
            // User opened the link on a different device or browser
            email = window.prompt("Please provide your email for confirmation");
          }

          if (email) {
            await signInWithMagicLink(email, window.location.href);
            window.localStorage.removeItem("emailForSignIn");
            setStatus("success");
            
            // Redirect to home or previous page
            setTimeout(() => {
              router.push("/");
            }, 2000);
          } else {
            throw new Error("Email is required to complete sign in.");
          }
        } else {
          // This happens if the link is not a valid magic link or already used
          setStatus("error");
          setErrorMessage("Invalid or expired sign-in link.");
        }
      } catch (error: any) {
        console.error("Magic link sign in error:", error);
        setStatus("error");
        setErrorMessage(error.message || "Failed to sign in. The link might have expired.");
      }
    };

    completeSignIn();
  }, [router]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-900 py-8 px-4 shadow-soft sm:rounded-[2rem] sm:px-10 border border-zinc-200 dark:border-zinc-800 text-center space-y-6">
          
          {status === "loading" && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <h2 className="text-xl font-bold">Verifying your link...</h2>
              <p className="text-muted-foreground text-sm">Please wait while we log you in securely.</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-500">
                <MailCheck className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold">Successfully logged in!</h2>
              <p className="text-muted-foreground text-sm">Redirecting you to the home page...</p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-500">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold">Sign-in Failed</h2>
              <p className="text-muted-foreground text-sm">{errorMessage}</p>
              <button 
                onClick={() => router.push("/")}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-xl font-medium"
              >
                Go to Home
              </button>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
