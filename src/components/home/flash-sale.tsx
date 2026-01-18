"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

export default function FlashSale() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement | null>(null);

    // Countdown timer state
    const [timeLeft, setTimeLeft] = useState({
        days: 8,
        hours: 24,
        minutes: 52,
        seconds: 0,
    });

    // Scroll animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px",
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    // Countdown timer logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { days, hours, minutes, seconds } = prev;

                if (seconds > 0) {
                    seconds--;
                } else if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                } else if (days > 0) {
                    days--;
                    hours = 23;
                    minutes = 59;
                    seconds = 59;
                }

                return { days, hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const timeBoxClass = "flex flex-col items-center justify-center h-14 w-14 md:h-20 md:w-20 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg relative overflow-hidden group";
    const timeNumberClass = "text-xl md:text-3xl font-black text-white z-10 font-outfit";
    const timeLabelClass = "text-[9px] md:text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1 z-10";

    return (
        <section className="container mx-auto px-4 py-16">
            <div
                ref={sectionRef}
                className="w-full relative overflow-hidden rounded-[2rem] bg-black shadow-2xl shadow-primary/20"
                style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(30px)",
                    transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
                }}
            >
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/3" />

                <div className="relative z-10 grid gap-8 p-6 md:grid-cols-2 md:gap-12 md:p-12 items-center">

                    {/* Left Content */}
                    <div className="flex flex-col justify-center space-y-6">
                        {/* Header */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold w-fit">
                                <Zap className="h-4 w-4 fill-current" />
                                <span>LIMITED TIME OFFER</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.9]">
                                FLASH <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">SALE</span>
                            </h2>
                            <p className="text-base md:text-lg text-neutral-400 max-w-md">
                                Grab your favorites at unbeatable prices. Up to <span className="text-white font-bold">40% OFF</span> on selected premium collection.
                            </p>
                        </div>

                        {/* Timer */}
                        <div className="flex gap-2 md:gap-4">
                            <div className={timeBoxClass}>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className={timeNumberClass}>{String(timeLeft.days).padStart(2, "0")}</span>
                                <span className={timeLabelClass}>Days</span>
                            </div>
                            <div className={timeBoxClass}>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className={timeNumberClass}>{String(timeLeft.hours).padStart(2, "0")}</span>
                                <span className={timeLabelClass}>Hrs</span>
                            </div>
                            <div className={timeBoxClass}>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className={timeNumberClass}>{String(timeLeft.minutes).padStart(2, "0")}</span>
                                <span className={timeLabelClass}>Mins</span>
                            </div>
                            <div className={timeBoxClass}>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className={timeNumberClass}>{String(timeLeft.seconds).padStart(2, "0")}</span>
                                <span className={timeLabelClass}>Secs</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="pt-2">
                            <Link href="/products?sale=flash">
                                <span className="group relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-primary to-orange-600 text-white rounded-full font-black text-lg shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden cursor-pointer">
                                    <span className="relative z-10 drop-shadow-sm">Grab Now</span>
                                    <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform drop-shadow-sm" />
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 mix-blend-overlay" />
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative h-full min-h-[300px] flex items-center justify-center group perspective-1000 mt-8 md:mt-0">
                        {/* Floating Cards Effect */}
                        <div className="absolute top-10 right-10 w-40 h-56 bg-neutral-800 rounded-2xl rotate-12 shadow-2xl z-0 opacity-60 scale-90 group-hover:rotate-6 group-hover:scale-95 transition-all duration-500 ease-out border border-white/5"></div>

                        <div className="relative w-64 md:w-80 aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 z-10 rotate-[-6deg] group-hover:rotate-0 transition-transform duration-500 ease-out border-4 border-white/10">
                            <Image
                                src="/gallery/vaanra-4.jpg"
                                alt="Flash Sale Product"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="text-white font-bold text-xl">Vaanra Bomber</div>
                                <div className="text-white/60 text-sm">Limited Edition</div>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="text-primary font-bold text-lg">₹2,499</span>
                                    <span className="text-white/40 line-through text-sm">₹4,999</span>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-20 bg-white text-black p-4 rounded-full font-black text-xl shadow-xl rotate-12 animate-pulse">
                            -40%
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
