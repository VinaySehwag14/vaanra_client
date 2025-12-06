"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { auth } from "@/lib/firebaseClient"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useRouter } from "next/navigation"
import { OtpLogin } from "@/components/auth/otp-login"
import { Chrome } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { signUpWithEmail, updateUserProfile } from "@/lib/authClient"
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

    // Redirect to profile if already authenticated
    useEffect(() => {
        if (!loading && user) {
            router.push("/profile")
        }
    }, [loading, user, router])

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider()
        try {
            await signInWithPopup(auth, provider)
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
            // 1. Create user in Firebase
            const userCredential = await signUpWithEmail(email, password)
            const user = userCredential.user

            // 2. Update Firebase profile
            await updateUserProfile(user, { displayName: name })

            // 3. Register user in backend
            // Note: We need to reload the user to ensure the displayName is updated in the auth token if needed,
            // but for now we'll just pass the user object which has the updated display name locally if we use the object returned by updateProfile?
            // Actually updateProfile returns void. We can manually set the displayName on the user object before sending it to backend if needed,
            // or rely on the backend to take the name from the request body if we were sending it separately.
            // But our ApiClient.registerUser takes the user object and extracts displayName.
            // Let's manually update the user object's displayName property for the API call since updateProfile doesn't update the local object immediately in all contexts?
            // Actually, let's just assume the user object is what we have.
            // To be safe, let's explicitly pass the name if the API supported it, but our API client extracts from user object.
            // Let's force update the property on the user object we have.
            // @ts-ignore
            user.displayName = name

            await ApiClient.registerUser(user)

            // 4. Redirect
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
