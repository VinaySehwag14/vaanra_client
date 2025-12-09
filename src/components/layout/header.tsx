"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingBag, Menu, Search, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import { useCart } from "@/context/cart-context"

const navLinks = [
    { href: "/products?category=t-shirts", label: "T-Shirts" },
    { href: "/products?category=hoodies", label: "Hoodies" },
    { href: "/products?category=sweatshirts", label: "Sweatshirts" },
    { href: "/products?category=seasonal", label: "Seasonal" },
]

export function Header() {
    return (
        <>
            <header className="sticky top-4 z-50 mx-auto w-[95%] max-w-7xl rounded-2xl border bg-background/80 shadow-sm backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                    <Logo />
                    <DesktopNav />
                    <div className="flex items-center gap-2 md:gap-4">
                        <ActionButtons />
                        <MobileNav />
                    </div>
                </div>
            </header>
            <MobileBottomNav />
        </>
    )
}

function Logo() {
    return (
        <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary" />
                <span className="text-xl font-bold tracking-tight">Urban Fox</span>
            </Link>
        </div>
    )
}

function DesktopNav() {
    return (
        <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    )
}

function ActionButtons() {
    const { user } = useAuth();
    const { cartCount } = useCart();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch by only rendering user-dependent UI after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    // Get user initials or default to "UF" (Urban Fox)
    const displayName = user?.displayName || user?.email?.split("@")[0] || "Urban Fox";
    const initials = user
        ? displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        : "UF";

    return (
        <>
            <Button variant="ghost" size="icon" className="hidden md:flex">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
            </Button>

            <Link href="/profile/saved">
                <Button variant="ghost" size="icon" className="hidden md:flex">
                    <Heart className="h-5 w-5" />
                    <span className="sr-only">Wishlist</span>
                </Button>
            </Link>

            <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingBag className="h-5 w-5" />
                    {cartCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-black">
                            {cartCount > 99 ? "99+" : cartCount}
                        </span>
                    )}
                    <span className="sr-only">Cart</span>
                </Button>
            </Link>

            {mounted && (
                <Link href={user ? "/profile" : "/login"} className="hidden md:block">
                    <Avatar className="h-8 w-8 bg-orange-100">
                        <AvatarImage src={user?.photoURL || "/avatars/01.png"} alt={displayName} />
                        <AvatarFallback className="bg-orange-200 text-orange-900">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </Link>
            )}
        </>
    )
}

function MobileNav() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-8 px-2">
                        <div className="h-8 w-8 rounded-lg bg-primary" />
                        <span className="text-xl font-bold tracking-tight">Urban Fox</span>
                    </div>

                    <nav className="flex-1 flex flex-col gap-6 px-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground hover:translate-x-1 duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
    )
}

function MobileBottomNav() {
    const { user } = useAuth();
    const { cartCount } = useCart();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch by only rendering user-dependent UI after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    // Get user initials or default to "UF" (Urban Fox)
    const displayName = user?.displayName || user?.email?.split("@")[0] || "Urban Fox";
    const initials = user
        ? displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        : "UF";

    return (
        <nav className="md:hidden fixed bottom-4 left-0 right-0 z-50 px-2">
            <div className="mx-auto max-w-md rounded-2xl border bg-background/80 shadow-lg backdrop-blur-md">
                <div className="flex items-center justify-around h-16 px-2">
                    <Link href="/" className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors group">
                        <div className="h-6 w-6 rounded-lg bg-primary/20 group-hover:bg-primary transition-colors flex items-center justify-center">
                            <div className="h-3 w-3 rounded bg-primary group-hover:bg-background" />
                        </div>
                        <span className="text-xs font-medium">Home</span>
                    </Link>

                    <Link href="/search" className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors group">
                        <Search className="h-5 w-5 group-hover:text-primary transition-colors" />
                        <span className="text-xs font-medium">Search</span>
                    </Link>

                    <Link href="/profile/saved" className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors group">
                        <Heart className="h-5 w-5 group-hover:text-primary transition-colors" />
                        <span className="text-xs font-medium">Wishlist</span>
                    </Link>

                    <Link href="/cart" className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors group relative">
                        <ShoppingBag className="h-5 w-5 group-hover:text-primary transition-colors" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-black">
                                {cartCount > 99 ? "99+" : cartCount}
                            </span>
                        )}
                        <span className="text-xs font-medium">Cart</span>
                    </Link>

                    <Link href={user ? "/profile" : "/login"} className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors group">
                        {mounted ? (
                            <Avatar className="h-5 w-5 border border-transparent group-hover:border-primary transition-colors">
                                <AvatarImage src={user?.photoURL || "/avatars/01.png"} />
                                <AvatarFallback className="text-[10px] bg-orange-200 text-orange-900">{initials}</AvatarFallback>
                            </Avatar>
                        ) : (
                            <div className="h-5 w-5 rounded-full bg-muted" />
                        )}
                        <span className="text-xs font-medium">Account</span>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
