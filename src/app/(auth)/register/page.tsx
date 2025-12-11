"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { auth } from "@/lib/firebaseClient"
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "next/navigation"
import { OtpLogin } from "@/components/auth/otp-login"
import { Chrome } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { ApiClient } from "@/lib/api-client"
import { AlertCircle, Loader2 } from "lucide-react"

export default function RegisterPage() {
    const [mode, setMode] = useState<"email" | "phone">("email")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [registerLoading, setRegisterLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const { user, loading } = useAuth()

    // Redirect logic removed to prevent race conditions during Google Registration.
    // Only manual redirects after successful registration/login will occur.

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider()
        try {
            const result = await signInWithPopup(auth, provider)
            // 1. Google Sign In Successful (Firebase)

            // 2. Register user in backend (Token Mode)
            await ApiClient.registerUser(result.user)

            // 3. Redirect to profile
            router.push("/profile")
        } catch (error) {
            console.error("Error signing in with Google", error)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setRegisterLoading(true)

        try {
            // 1. Register user in backend (Credentials Mode - Server-side creation)
            await ApiClient.registerUser({
                name,
                email,
                password
            })

            // 2. Sign in with Firebase (to establish session)
            // Since backend created the user, we can now sign in
            await signInWithEmailAndPassword(auth, email, password)

            // 3. Redirect to profile
            router.push("/profile")
        } catch (err: any) {
            console.error("Registration error:", err)
            if (err.code === "auth/email-already-in-use") {
                setError("Email is already in use. Please sign in instead.")
            } else if (err.code === "auth/weak-password") {
                setError("Password is too weak. Please use a stronger password.")
            } else {
                setError(err.message || "Failed to register. Please try again.")
            }
        } finally {
            setRegisterLoading(false)
        }
    }

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-muted/40">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    // Don't render register form if user is authenticated (will redirect)
    if (user) {
        return null
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Register</CardTitle>
                    <CardDescription>
                        {mode === "email"
                            ? "Create a new account to start shopping."
                            : "Register with your phone number."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {mode === "email" ? (
                        <form onSubmit={handleRegister} className="grid gap-4">
                            {error && (
                                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={registerLoading}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={registerLoading}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={registerLoading}
                                />
                            </div>
                            <Button className="w-full" type="submit" disabled={registerLoading}>
                                {registerLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create account
                            </Button>
                        </form>
                    ) : (
                        <OtpLogin />
                    )}

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                        <Chrome className="mr-2 h-4 w-4" />
                        Google
                    </Button>

                    <Button
                        variant="link"
                        className="w-full"
                        onClick={() => setMode(mode === "email" ? "phone" : "email")}
                    >
                        {mode === "email" ? "Register with Phone" : "Register with Email"}
                    </Button>
                </CardContent>
                <CardFooter>
                    <div className="text-sm text-center w-full">
                        Already have an account?{" "}
                        <Link href="/login" className="underline">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
