"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, Zap, Siren, Users, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeaturedProductProps {
    badge?: string;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    image: string;
    imageAlt: string;
}

export default function FeaturedProduct({
    badge = "JUST DROPPED",
    title = "The Wave Hoodie",
    description = "Ultra-heavyweight cotton. Boxy fit. The essential hoodie for the season.",
    buttonText = "Grab Now",
    buttonLink = "/products?collection=wave-hoodie",
    image = "/gallery/vaanra-4.jpg",
    imageAlt = "The Wave Hoodie",
}: Partial<FeaturedProductProps> = {}) {
    return (
        <section className="w-full py-8">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-950 border border-zinc-800 shadow-2xl mx-auto max-w-7xl">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] mix-blend-screen" />

                <div className="flex flex-col md:flex-row h-auto md:h-[480px]">
                    {/* Visual Side (Left) */}
                    <div className="relative w-full md:w-1/2 h-[350px] md:h-full bg-zinc-900 group overflow-hidden">
                        <Image
                            src={image}
                            alt={imageAlt}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />

                        {/* Simplified Live Status - Top Left */}
                        <div className="absolute top-6 left-6 flex items-center gap-2">
                            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-bold text-white shadow-lg">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                LIVE
                            </div>
                            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-bold text-white shadow-lg">
                                <Users className="w-3 h-3 text-zinc-400" />
                                <span>128 viewing</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Side (Right) */}
                    <div className="relative w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-black/40 backdrop-blur-sm">

                        {/* Hype Banner */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-red-600 text-white text-[10px] font-black tracking-widest uppercase skew-x-[-10deg]">
                                <Flame className="w-3 h-3 fill-white" />
                                {badge}
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-2 py-1 text-orange-400 text-[10px] font-bold tracking-widest uppercase border border-orange-500/30 rounded-sm">
                                <Zap className="w-3 h-3 fill-orange-400" />
                                Fast Mover
                            </div>
                        </div>

                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 leading-[0.9] italic uppercase">
                            {title}
                        </h2>

                        <p className="text-zinc-400 text-lg mb-8 max-w-sm font-medium">
                            {description}
                        </p>

                        {/* Stock Meter & Quantity */}
                        <div className="mb-8 w-full max-w-sm bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                            <div className="flex justify-between items-end mb-2">
                                <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                                    <Package className="w-3 h-3" />
                                    <span>Stock Remaining</span>
                                </div>
                                <span className="text-red-500 font-mono font-bold text-sm">Only 12 left</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-red-600 to-orange-500 w-[12%] rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button asChild size="lg" className="h-14 px-10 rounded-full bg-white text-black hover:bg-primary hover:text-white hover:scale-105 transition-all text-lg font-black uppercase tracking-wide shadow-xl">
                                <Link href={buttonLink}>
                                    {buttonText} <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
