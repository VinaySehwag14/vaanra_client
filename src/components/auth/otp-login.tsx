"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth } from "@/lib/firebaseClient"
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth"
import { useRouter } from "next/navigation"
import { AlertCircle, Loader2 } from "lucide-react"

export function OtpLogin() {
    const [phoneNumber, setPhoneNumber] = useState("")
    const [otp, setOtp] = useState("")
    const [verificationId, setVerificationId] = useState<ConfirmationResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
                size: "invisible",
                callback: (response: any) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                },
                "expired-callback": () => {
                    // Response expired. Ask user to solve reCAPTCHA again.
                },
            })
        }
    }, [])

    const handleSendOtp = async () => {
        setError(null)
        setLoading(true)
        try {
            const appVerifier = window.recaptchaVerifier
            const formattedPhoneNumber = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`
            const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier)
            setVerificationId(confirmationResult)
        } catch (err: any) {
            console.error("Error sending OTP:", err)
            if (err.code === 'auth/operation-not-allowed') {
                setError("Phone authentication is not enabled in Firebase Console. Please enable it.")
            } else if (err.code === 'auth/invalid-app-credential') {
                setError("Invalid app credential. Please check if domain is whitelisted in Firebase Console -> Authentication -> Settings -> Authorized Domains.")
            } else if (err.code === 'auth/too-many-requests') {
                setError("Too many requests. Please wait a while before trying again, or use a test phone number registered in Firebase Console.")
            } else {
                setError(err.message || "Failed to send OTP. Please try again.")
            }
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear()
                window.recaptchaVerifier = undefined // Force re-init
            }
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async () => {
        if (!verificationId) return
        setError(null)
        setLoading(true)
        try {
            // Verify OTP with Firebase - useAuth hook will handle database verification
            await verificationId.confirm(otp)
            // Redirect after successful authentication - useAuth will verify user
            router.push("/")
        } catch (err: any) {
            console.error("Error verifying OTP:", err)
            setError("Invalid OTP. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid gap-6">
            {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            {!verificationId ? (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="phone" className="text-base font-medium">Phone Number</Label>
                        <div className="flex gap-2">
                            <div className="flex items-center justify-center px-3 border rounded-md bg-muted/20 text-muted-foreground w-[70px]">
                                <span className="text-sm font-medium">+91</span>
                                {/* Mock Country Code Selector - could be a Select later */}
                            </div>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="9876543210"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                disabled={loading}
                                className="flex-1 h-11 bg-muted/20 border-input/50"
                            />
                        </div>
                    </div>
                    <div id="recaptcha-container" className="hidden"></div>
                    <Button
                        onClick={handleSendOtp}
                        disabled={loading || !phoneNumber}
                        className="w-full h-11 rounded-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-medium text-base shadow-md transition-all"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send OTP
                    </Button>
                </>
            ) : (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="otp" className="text-base font-medium">Enter OTP</Label>
                        <Input
                            id="otp"
                            type="text"
                            placeholder="123456"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            disabled={loading}
                            className="h-11 bg-muted/20 border-input/50 text-center tracking-widest text-lg"
                        />
                    </div>
                    <Button
                        onClick={handleVerifyOtp}
                        disabled={loading || !otp}
                        className="w-full h-11 rounded-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-medium text-base shadow-md transition-all"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Verify OTP
                    </Button>
                    <Button variant="ghost" onClick={() => setVerificationId(null)} disabled={loading} className="w-full text-muted-foreground">
                        Back to Phone Number
                    </Button>
                </>
            )}
        </div>
    )
}

declare global {
    interface Window {
        recaptchaVerifier: any
    }
}
