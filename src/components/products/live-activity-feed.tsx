"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Eye, TrendingUp, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
    id: string;
    type: "purchase" | "viewing" | "trending" | "stock";
    message: string;
    timestamp: Date;
    icon: typeof ShoppingCart;
    color: string;
}

const mockActivities: Omit<Activity, "id" | "timestamp">[] = [
    { type: "purchase", message: "Sarah from Mumbai just purchased this", icon: ShoppingCart, color: "text-green-500" },
    { type: "viewing", message: "127 people are viewing this item", icon: Eye, color: "text-blue-500" },
    { type: "purchase", message: "Raj from Delhi bought 2 items", icon: ShoppingCart, color: "text-green-500" },
    { type: "trending", message: "This item is trending in your area", icon: TrendingUp, color: "text-purple-500" },
    { type: "stock", message: "Only 3 items left in stock!", icon: Package, color: "text-red-500" },
    { type: "purchase", message: "Priya from Bangalore just ordered", icon: ShoppingCart, color: "text-green-500" },
    { type: "viewing", message: "89 people added this to wishlist", icon: Eye, color: "text-blue-500" },
];

export default function LiveActivityFeed() {
    const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
    const [activityIndex, setActivityIndex] = useState(0);

    useEffect(() => {
        const showActivity = () => {
            const activity = mockActivities[activityIndex];
            setCurrentActivity({
                ...activity,
                id: `${Date.now()}-${activityIndex}`,
                timestamp: new Date(),
            });

            // Hide after 4 seconds
            setTimeout(() => {
                setCurrentActivity(null);
            }, 4000);

            // Move to next activity
            setActivityIndex((prev) => (prev + 1) % mockActivities.length);
        };

        // Show first activity after 2 seconds
        const initialTimeout = setTimeout(showActivity, 2000);

        // Then show new activity every 8 seconds
        const interval = setInterval(showActivity, 8000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, [activityIndex]);

    return (
        <div className="fixed bottom-24 left-4 z-40 md:bottom-8">
            <AnimatePresence mode="wait">
                {currentActivity && (
                    <motion.div
                        key={currentActivity.id}
                        initial={{ opacity: 0, x: -100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -100, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="relative max-w-xs"
                    >
                        {/* Glassmorphism card */}
                        <div className="rounded-2xl border border-white/20 bg-white/90 p-4 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/90">
                            <div className="flex items-start gap-3">
                                {/* Icon */}
                                <div className={cn(
                                    "rounded-full bg-white p-2 shadow-sm dark:bg-zinc-800",
                                    currentActivity.color
                                )}>
                                    <currentActivity.icon className="h-4 w-4" />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                        {currentActivity.message}
                                    </p>
                                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                        Just now
                                    </p>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 4, ease: "linear" }}
                                className="absolute bottom-0 left-0 h-0.5 bg-primary"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
