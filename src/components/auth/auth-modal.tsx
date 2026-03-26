"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuthContext } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chrome, Mail, Phone, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { signInWithGoogle, sendMagicLink } from "@/lib/authClient";
import { OtpLogin } from "@/components/auth/otp-login";
import { useAuth } from "@/hooks/useAuth";

type AuthMode = "main" | "email" | "phone";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useAuthContext();
  const { user, loading: authLoading } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>("main");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Close modal if user gets authenticated
  useEffect(() => {
    if (user && !authLoading && isAuthModalOpen) {
      closeAuthModal();
      // Reset state for next time
      setTimeout(() => {
        setMode("main");
        setError(null);
        setSuccessMsg(null);
      }, 300);
    }
  }, [user, authLoading, isAuthModalOpen, closeAuthModal]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      // The useAuth hook will handle the backend verifyOrCreate call and close the modal
    } catch (err: any) {
      console.error("Google login error:", err);
      // Ignore popup closed errors
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Failed to sign in with Google. Please try again.");
      }
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // Create callback URL based on current origin
      const callbackUrl = `${window.location.origin}/auth/callback`;
      await sendMagicLink(email, callbackUrl);
      
      // Save email in localStorage so we don't have to ask for it again on the callback page
      window.localStorage.setItem('emailForSignIn', email);
      
      setSuccessMsg("Check your inbox! A magic link has been sent to " + email);
    } catch (err: any) {
      console.error("Magic link error:", err);
      setError(err.message || "Failed to send magic link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setMode("main");
    setError(null);
    setSuccessMsg(null);
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-[1.5rem] border-zinc-200 dark:border-zinc-800">
        <div className="p-6 md:p-8 space-y-6">
          <DialogHeader className="space-y-2 text-center">
            <DialogTitle className="text-2xl font-bold">
              {mode === "main" && "Welcome to Vaanra"}
              {mode === "email" && "Log in with Email"}
              {mode === "phone" && "Log in with Phone"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              {mode === "main" && "Log in or create an account to continue"}
              {mode === "email" && "We'll send a magic link to your inbox"}
              {mode === "phone" && "We'll send a one-time password to your phone"}
            </DialogDescription>
          </DialogHeader>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl flex items-start gap-2 border border-red-200 dark:border-red-900/20">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* MAIN MODE: Method Selection */}
          {mode === "main" && (
            <div className="space-y-3 pt-2">
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl border-input/50 hover:bg-muted/30 flex items-center justify-center gap-3 relative"
                onClick={handleGoogleLogin}
                disabled={loading || authLoading}
              >
                {(loading || authLoading) ? (
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <Chrome className="w-5 h-5 absolute left-4" />
                    <span className="font-semibold text-[15px]">Continue with Google</span>
                  </>
                )}
              </Button>

              <div className="relative py-4 flex items-center">
                <div className="flex-1 border-t border-border"></div>
                <span className="shrink-0 px-4 text-xs text-muted-foreground font-medium uppercase tracking-wider">Or continue with</span>
                <div className="flex-1 border-t border-border"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-xl border-input/50 hover:bg-muted/30 font-medium"
                  onClick={() => setMode("email")}
                  disabled={loading || authLoading}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-xl border-input/50 hover:bg-muted/30 font-medium"
                  onClick={() => setMode("phone")}
                  disabled={loading || authLoading}
                >
                  <Phone className="w-4 h-4 mr-2 text-primary" />
                  Phone OTP
                </Button>
              </div>
            </div>
          )}

          {/* EMAIL MODE: Magic Link */}
          {mode === "email" && (
            <div className="space-y-4 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetState}
                className="mb-2 -ml-3 text-muted-foreground hover:text-foreground h-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {successMsg ? (
                <div className="bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 text-center p-6 rounded-xl border border-green-200 dark:border-green-900/20 space-y-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-500">
                    <Mail className="w-6 h-6" />
                  </div>
                  <p className="font-medium text-[15px]">{successMsg}</p>
                  <p className="text-sm opacity-80">You can safely close this window.</p>
                </div>
              ) : (
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-semibold">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 rounded-xl bg-muted/30"
                      autoFocus
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl font-bold bg-[#0EA5E9] hover:bg-[#0284C7] text-white shadow-md shadow-sky-500/20"
                    disabled={loading || !email}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Send Magic Link"
                    )}
                  </Button>
                </form>
              )}
            </div>
          )}

          {/* PHONE MODE: OTP */}
          {mode === "phone" && (
            <div className="space-y-4 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetState}
                className="mb-2 -ml-3 text-muted-foreground hover:text-foreground h-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="pt-2">
                <OtpLogin />
              </div>
            </div>
          )}
          
          <div className="pt-4 text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
