"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ShoppingBag, Menu, Search, Heart, User, X, LogOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import { useCart } from "@/context/cart-context"
import { cn } from "@/lib/utils"

const navLinks = [
    { href: "/products?category=t-shirts", label: "T-Shirts" },
    { href: "/products?category=hoodies", label: "Hoodies" },
    { href: "/products?category=sweatshirts", label: "Sweatshirts" },
    { href: "/products?category=seasonal", label: "Seasonal" },
]

export function Header() {
    const pathname = usePathname()
    // Header is transparent only on homepage and product details
    const isTransparent = pathname === "/" || pathname.startsWith("/products/");

    return (
        <div className={cn(
            "z-50 w-full transition-all duration-500",
            isTransparent ? "absolute top-0" : "relative",
        )}>
            <AnnouncementBar />
            <motion.header
                className={cn(
                    "w-full transition-all duration-500",
                    isTransparent
                        ? "bg-transparent py-4 md:py-6"
                        : "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shadow-sm border-b border-zinc-200/50 dark:border-zinc-800/50 py-3"
                )}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Logo isTransparent={isTransparent} />
                        <DesktopNav pathname={pathname} isTransparent={isTransparent} />
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        <ActionButtons isTransparent={isTransparent} />
                        <MobileNav pathname={pathname} isTransparent={isTransparent} />
                    </div>
                </div>
            </motion.header>
            <MobileBottomNav pathname={pathname} />
        </div>
    )
}

function LogoIcon({ className = "h-10 w-10" }: { className?: string }) {
    const [error, setError] = useState(false)

    if (error) {
        return <div className={cn("rounded-xl bg-gradient-primary", className)} />
    }

    return (
        <div className={cn("relative transition-transform duration-300 hover:scale-110", className)}>
            <Image
                src="/logo/vaanra_iconic_rm_bg.png"
                alt="Vaanra Logo"
                fill
                className="object-contain"
                priority
                onError={() => setError(true)}
            />
        </div>
    )
}

function Logo({ isTransparent }: { isTransparent: boolean }) {
    return (
        <Link href="/" className="flex items-center gap-2 group">
            {/* Iconic Logo */}
            <LogoIcon className="w-12 h-12 md:w-14 md:h-14" />

            {/* Brand Name with Effect */}
            <span
                className={cn(
                    "text-xl md:text-2xl font-bold tracking-tight transition-all duration-300",
                    "bg-clip-text text-transparent",
                    isTransparent
                        ? "bg-gradient-to-r from-white via-white to-white/80"
                        : "bg-gradient-to-r from-[#DD6031] via-[#E07A4C] to-[#DD6031]",
                    "group-hover:tracking-wide"
                )}
                style={{
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "0.02em"
                }}
            >
                VAANRA
            </span>
        </Link>
    )
}

function DesktopNav({ pathname, isTransparent }: { pathname: string, isTransparent: boolean }) {
    return (
        <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "relative px-4 py-2 text-sm font-medium tracking-wide transition-colors hover:text-primary",
                            isActive
                                ? "text-primary"
                                : isTransparent ? "text-white/90 hover:text-white" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {link.label}
                        {isActive && (
                            <motion.div
                                layoutId="activeNav"
                                className={cn(
                                    "absolute inset-0 rounded-full -z-10",
                                    isTransparent ? "bg-white/10" : "bg-primary/5"
                                )}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </Link>
                )
            })}
        </nav>
    )
}

function ActionButtons({ isTransparent }: { isTransparent: boolean }) {
    const { user } = useAuth();
    const { cartCount } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const displayName = user?.displayName || user?.email?.split("@")[0] || "Vaanra";
    const initials = user
        ? displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        : "UF";

    const buttonClass = cn(
        "hidden md:flex rounded-full transition-colors",
        isTransparent ? "text-white hover:bg-white/20" : "text-foreground hover:bg-secondary"
    );

    const cartButtonClass = cn(
        "relative rounded-full transition-colors",
        isTransparent ? "text-white hover:bg-white/20" : "text-foreground hover:bg-secondary"
    );

    return (
        <>
            <Button variant="ghost" size="icon" className={buttonClass}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
            </Button>

            <Link href="/profile/saved">
                <Button variant="ghost" size="icon" className={buttonClass}>
                    <Heart className="h-5 w-5" />
                    <span className="sr-only">Wishlist</span>
                </Button>
            </Link>

            <Link href="/cart">
                <Button variant="ghost" size="icon" className={cartButtonClass}>
                    <ShoppingBag className="h-5 w-5" />
                    {cartCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-extrabold text-white shadow-md ring-2 ring-white dark:ring-black"
                        >
                            {cartCount > 99 ? "99+" : cartCount}
                        </motion.span>
                    )}
                    <span className="sr-only">Cart</span>
                </Button>
            </Link>

            {mounted && user ? (
                <Link href="/profile" className="hidden md:block ml-2">
                    <Avatar className="h-9 w-9 ring-2 ring-primary/10 transition-transform hover:scale-105 active:scale-95">
                        <AvatarImage src={user?.photoURL || "/avatars/01.png"} alt={displayName} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </Link>
            ) : mounted && (
                <Link href="/login" className="hidden md:block ml-2">
                    <Button variant="default" size="sm" className="bg-gradient-primary rounded-full px-5 hover:opacity-90 transition-opacity">
                        Login
                    </Button>
                </Link>
            )}
        </>
    )
}

function MobileNav({ pathname, isTransparent }: { pathname: string, isTransparent: boolean }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("md:hidden rounded-full", isTransparent ? "text-white hover:bg-white/20" : "")}>
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] border-r border-white/20 bg-glass backdrop-blur-xl">
                <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-10 px-2 mt-4">
                        <LogoIcon className="w-52 h-20" />
                    </div>

                    <nav className="flex-1 flex flex-col gap-2 px-2">
                        {navLinks.map((link, idx) => {
                            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                            return (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-xl transition-all duration-300 border border-transparent",
                                            isActive
                                                ? "bg-primary/5 border-primary/10 text-primary font-semibold translate-x-1"
                                                : "text-muted-foreground hover:text-foreground hover:bg-white/50 hover:pl-6"
                                        )}
                                    >
                                        <span className="text-lg">{link.label}</span>
                                        {isActive && <div className="h-2 w-2 rounded-full bg-primary" />}
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </nav>

                    <div className="mt-auto px-2 pb-6">
                        <SheetClose asChild>
                            <Button variant="outline" className="w-full rounded-xl border-dashed h-12">
                                Close Menu
                            </Button>
                        </SheetClose>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

function MobileBottomNav({ pathname }: { pathname: string }) {
    const { user } = useAuth();
    const { cartCount } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50">
            <div className="mx-auto max-w-md rounded-2xl bg-glass shadow-soft border border-white/20 backdrop-blur-xl">
                <div className="flex items-center justify-around h-16 px-1">
                    <BottomNavLink
                        href="/"
                        icon={<div className={cn("h-5 w-5 rounded transition-colors", pathname === "/" ? "bg-primary" : "bg-primary/30")} />}
                        label="Home"
                        active={pathname === "/"}
                    />

                    <BottomNavLink
                        href="/search"
                        icon={<Search className="h-5 w-5" />}
                        label="Search"
                        active={pathname === "/search"}
                    />

                    <BottomNavLink
                        href="/cart"
                        icon={<ShoppingBag className="h-5 w-5" />}
                        label="Cart"
                        active={pathname === "/cart"}
                        badge={cartCount}
                    />

                    <BottomNavLink
                        href={user ? "/profile" : "/login"}
                        icon={mounted && user ? (
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={user?.photoURL || "/avatars/01.png"} />
                                <AvatarFallback className="text-[9px] bg-primary/10 text-primary">UF</AvatarFallback>
                            </Avatar>
                        ) : (
                            <User className="h-5 w-5" />
                        )}
                        label="Account"
                        active={pathname.startsWith("/profile")}
                    />
                </div>
            </div>
        </nav>
    )
}

function BottomNavLink({ href, icon, label, active, badge }: { href: string, icon: React.ReactNode, label: string, active: boolean, badge?: number }) {
    return (
        <Link
            href={href}
            className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 transition-all duration-300 relative group",
                active ? "scale-110" : "scale-100 opacity-70 hover:opacity-100"
            )}
        >
            <div className={cn("relative", active && "text-primary")}>
                {icon}
                {badge !== undefined && badge > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-primary text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                        {badge > 99 ? "99+" : badge}
                    </span>
                )}
            </div>
            <span className={cn("text-[10px] font-medium transition-colors", active ? "text-primary font-bold" : "text-muted-foreground")}>
                {label}
            </span>
        </Link>
    )
}
