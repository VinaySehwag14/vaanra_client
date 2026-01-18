"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
    link: string;
    position: { top: string; left: string };
}

interface Look {
    id: number;
    title: string;
    description: string;
    image: string;
    products: Product[];
}

const looks: Look[] = [
    {
        id: 1,
        title: "Vaanra Utility",
        description: "Engineered for the city. Functional cuts meet premium tech fabrics for the ultimate commuter reflex.",
        image: "/gallery/vaanra-3.jpg",
        products: [
            {
                id: 101,
                name: "Tech Hoodie",
                price: "₹3,999",
                image: "/gallery/vaanra-3.jpg",
                link: "/products?category=hoodies",
                position: { top: "30%", left: "50%" }
            },
            {
                id: 102,
                name: "Utility Cargo",
                price: "₹2,499",
                image: "/gallery/vaanra-2.jpg",
                link: "/products?category=pants",
                position: { top: "65%", left: "55%" }
            }
        ]
    },
    {
        id: 2,
        title: "Monochrome Set",
        description: "Effortless coordination. The matching set that takes the thinking out of getting dressed.",
        image: "/gallery/vaanra-1.jpg",
        products: [
            {
                id: 201,
                name: "Relaxed Tee",
                price: "₹1,499",
                image: "/gallery/vaanra-1.jpg",
                link: "/products?category=t-shirts",
                position: { top: "35%", left: "45%" }
            },
            {
                id: 202,
                name: "Sweat Shorts",
                price: "₹1,299",
                image: "/gallery/vaanra-1.jpg",
                link: "/products?category=shorts",
                position: { top: "68%", left: "48%" }
            }
        ]
    },
    {
        id: 3,
        title: "Statement Pop",
        description: "Stand out in the crowd with our signature yellow hue.",
        image: "/gallery/vaanra-4.jpg",
        products: [
            {
                id: 301,
                name: "Heavyweight Hoodie",
                price: "₹4,499",
                image: "/gallery/vaanra-4.jpg",
                link: "/products?color=yellow",
                position: { top: "40%", left: "50%" }
            }
        ]
    }
];

export default function ShopTheLook() {
    const [activeLook, setActiveLook] = useState(looks[0]);
    const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

    return (
        <section className="w-full py-12 md:py-16 bg-black relative overflow-hidden">
            {/* Deep Ambient Background - Scaled Down */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2 opacity-50" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2 opacity-30" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center justify-center">

                    {/* Left: Floating Interactive Image - Compact */}
                    <div className="relative w-full max-w-sm lg:w-[40%] perspective-1000 group">
                        {/* Back Glow */}
                        <div className="absolute inset-4 bg-primary/20 blur-xl rounded-[2rem] -z-10 group-hover:bg-primary/30 transition-colors duration-500" />

                        {/* Card Container */}
                        <div className="relative aspect-[3/4] w-full transform transition-all duration-700 ease-out rotate-[-3deg] group-hover:rotate-0 hover:scale-105 shadow-2xl shadow-black/50 z-20">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeLook.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0"
                                >
                                    {/* Image Wrapper with Clipping */}
                                    <div className="absolute inset-0 rounded-[2rem] overflow-hidden border border-white/10">
                                        <Image
                                            src={activeLook.image}
                                            alt={activeLook.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 40vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                                    </div>

                                    {/* Hotspots Container - No Clipping */}
                                    <div className="absolute inset-0 z-30">
                                        {activeLook.products.map((product) => (
                                            <div
                                                key={product.id}
                                                className="absolute"
                                                style={{ top: product.position.top, left: product.position.left }}
                                                onMouseEnter={() => setHoveredProduct(product.id)}
                                                onMouseLeave={() => setHoveredProduct(null)}
                                            >
                                                <div className="relative -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group/hotspot">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-50 duration-1000"></span>
                                                    <div className="relative flex items-center justify-center h-6 w-6 rounded-full bg-white/20 backdrop-blur-md border border-white/60 shadow-lg transition-transform hover:scale-110 group-hover/hotspot:bg-white group-hover/hotspot:text-black">
                                                        <div className="h-2 w-2 bg-white rounded-full shadow-sm group-hover/hotspot:bg-black transition-colors" />
                                                    </div>

                                                    <AnimatePresence>
                                                        {hoveredProduct === product.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10, x: 15, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, x: 15, scale: 1 }}
                                                                exit={{ opacity: 0, y: 5, x: 15, scale: 0.95 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="absolute top-1/2 left-full w-56 bg-black/90 backdrop-blur-xl rounded-xl p-2.5 shadow-2xl border border-white/10 z-[100] pointer-events-none md:pointer-events-auto ml-2"
                                                            >
                                                                <div className="flex gap-2.5">
                                                                    <div className="relative w-12 h-16 rounded-md overflow-hidden shrink-0 bg-zinc-800 border border-white/5">
                                                                        <Image
                                                                            src={product.image}
                                                                            alt={product.name}
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                    </div>
                                                                    <div className="flex flex-col justify-center text-left">
                                                                        <h4 className="font-bold text-xs text-white leading-tight">{product.name}</h4>
                                                                        <p className="text-zinc-400 text-[10px] mt-0.5">{product.price}</p>
                                                                        <Link href={product.link} className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-primary hover:text-white mt-1.5 transition-colors group/link">
                                                                            Shop <ArrowRight className="w-2.5 h-2.5 group-hover/link:translate-x-0.5 transition-transform" />
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right: Compact Content */}
                    <div className="w-full lg:w-[45%] text-white flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-bold uppercase tracking-widest w-fit mb-6 backdrop-blur-sm">
                            <Sparkles className="w-3 h-3 text-primary" />
                            <span>The Studio Edit</span>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeLook.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="mb-10"
                            >
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-[0.9] tracking-tighter">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
                                        {activeLook.title}
                                    </span>
                                </h2>
                                <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-md font-light">
                                    {activeLook.description}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Look Switcher - Minimal Design */}
                        <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3 ml-1">Select Vibe</h4>
                            <div className="flex gap-3">
                                {looks.map((look) => (
                                    <button
                                        key={look.id}
                                        onClick={() => setActiveLook(look)}
                                        className={cn(
                                            "relative w-14 h-14 rounded-full overflow-hidden transition-all duration-300 shrink-0",
                                            activeLook.id === look.id
                                                ? "ring-2 ring-primary ring-offset-2 ring-offset-black scale-110 opacity-100"
                                                : "opacity-40 hover:opacity-100 grayscale hover:grayscale-0 hover:scale-105"
                                        )}
                                    >
                                        <Image
                                            src={look.image}
                                            alt={look.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
