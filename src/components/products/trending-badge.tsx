"use client";

import { motion } from "framer-motion";
import { Flame, TrendingUp, Zap, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendingBadgeProps {
    type?: "trending" | "hot" | "new" | "popular";
    className?: string;
}

export default function TrendingBadge({ type = "trending", className }: TrendingBadgeProps) {
    const configs = {
        trending: {
            icon: TrendingUp,
            label: "Trending",
            bg: "bg-gradient-to-r from-purple-500 to-pink-500",
            iconColor: "text-white",
        },
        hot: {
            icon: Flame,
            label: "Hot",
            bg: "bg-gradient-to-r from-orange-500 to-red-500",
            iconColor: "text-white",
        },
        new: {
            icon: Zap,
            label: "New",
            bg: "bg-gradient-to-r from-blue-500 to-cyan-500",
            iconColor: "text-white",
        },
        popular: {
            icon: Star,
            label: "Popular",
            bg: "bg-gradient-to-r from-yellow-500 to-orange-500",
            iconColor: "text-white",
        },
    };

    const config = configs[type];
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className={cn(
                "relative flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider shadow-lg",
                config.bg,
                className
            )}
        >
            {/* Subtle Pulse Effect - only once on mount */}
            <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.3, opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={cn("absolute inset-0 rounded-full", config.bg)}
            />

            {/* Static Icon */}
            <Icon className={cn("h-3 w-3 relative z-10", config.iconColor)} />

            {/* Label */}
            <span className={cn("relative z-10", config.iconColor)}>{config.label}</span>
        </motion.div>
    );
}
