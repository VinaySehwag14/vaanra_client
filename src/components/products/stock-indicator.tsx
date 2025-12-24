"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StockIndicatorProps {
    stock: number;
    threshold?: {
        low: number;
        medium: number;
    };
    className?: string;
}

export default function StockIndicator({
    stock,
    threshold = { low: 5, medium: 15 },
    className
}: StockIndicatorProps) {
    const getStockStatus = () => {
        if (stock === 0) return { label: "Out of Stock", color: "bg-zinc-400", textColor: "text-zinc-600", show: false };
        if (stock <= threshold.low) return { label: `Only ${stock} left!`, color: "bg-red-500", textColor: "text-red-600", show: true, urgent: true };
        if (stock <= threshold.medium) return { label: `${stock} in stock`, color: "bg-yellow-500", textColor: "text-yellow-600", show: true, urgent: false };
        return { label: "In Stock", color: "bg-green-500", textColor: "text-green-600", show: false };
    };

    const status = getStockStatus();

    if (!status.show) return null;

    const percentage = Math.min((stock / threshold.medium) * 100, 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex items-center gap-2", className)}
        >
            {/* Stock Badge */}
            <div className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                status.urgent ? "bg-red-50 dark:bg-red-950/30" : "bg-yellow-50 dark:bg-yellow-950/30"
            )}>
                {status.urgent && (
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className={cn("h-1.5 w-1.5 rounded-full", status.color)}
                    />
                )}
                <span className={status.textColor}>{status.label}</span>
            </div>

            {/* Progress Bar */}
            {stock <= threshold.medium && (
                <div className="relative h-1 w-12 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={cn("h-full", status.color)}
                    />
                </div>
            )}
        </motion.div>
    );
}
