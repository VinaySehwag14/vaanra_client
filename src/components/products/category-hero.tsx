"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TrendingUp, Users, ShoppingBag, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryHeroProps {
    title: string;
    description: string;
    image: string;
}

export default function CategoryHero({
    title,
    description,
    image,
}: CategoryHeroProps) {
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 30 });

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;

                if (seconds > 0) {
                    seconds--;
                } else if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                }

                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative mb-8 h-[400px] w-full overflow-hidden rounded-3xl bg-zinc-900 md:h-[500px]">
            {/* Background Image with Parallax Effect */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0"
            >
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover opacity-50"
                    priority
                />
            </motion.div>

            {/* Animated Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <motion.div
                animate={{
                    background: [
                        "radial-gradient(circle at 20% 50%, rgba(var(--primary-rgb), 0.3) 0%, transparent 50%)",
                        "radial-gradient(circle at 80% 50%, rgba(var(--primary-rgb), 0.3) 0%, transparent 50%)",
                        "radial-gradient(circle at 20% 50%, rgba(var(--primary-rgb), 0.3) 0%, transparent 50%)",
                    ],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
            />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16">
                <div className="max-w-3xl">
                    {/* Trending Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-4 flex items-center gap-3"
                    >
                        <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 shadow-lg">
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                            >
                                <TrendingUp className="h-3.5 w-3.5 text-white" />
                            </motion.div>
                            <span className="text-xs font-bold uppercase tracking-wider text-white">
                                Trending Now
                            </span>
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-md">
                            <Users className="h-3.5 w-3.5 text-white" />
                            <span className="text-xs font-medium text-white">
                                10,000+ customers
                            </span>
                        </div>
                    </motion.div>

                    {/* Category Label */}
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-primary"
                    >
                        THE {title} COLLECTION
                    </motion.span>

                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-4 text-4xl font-black leading-tight text-white md:text-6xl lg:text-7xl"
                    >
                        Stay Warm in{" "}
                        <span className="bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">
                            Style.
                        </span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-6 max-w-2xl text-base text-zinc-200 md:text-lg"
                    >
                        {description}
                    </motion.p>

                    {/* Flash Sale Timer */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="inline-flex flex-col gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl md:flex-row md:items-center"
                    >
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm font-bold text-white">Flash Sale Ends In:</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TimeUnit value={timeLeft.hours} label="Hours" />
                            <span className="text-white">:</span>
                            <TimeUnit value={timeLeft.minutes} label="Min" />
                            <span className="text-white">:</span>
                            <TimeUnit value={timeLeft.seconds} label="Sec" />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Activity Indicator */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="absolute bottom-6 right-6 hidden rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-xl md:block"
            >
                <div className="flex items-center gap-2">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-2 w-2 rounded-full bg-green-500"
                    />
                    <ShoppingBag className="h-4 w-4 text-white" />
                    <span className="text-sm font-medium text-white">
                        <span className="font-bold text-primary">47</span> items added in last hour
                    </span>
                </div>
            </motion.div>
        </div>
    );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <motion.div
                key={value}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm"
            >
                <span className="text-lg font-bold text-white">
                    {value.toString().padStart(2, '0')}
                </span>
            </motion.div>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                {label}
            </span>
        </div>
    );
}
