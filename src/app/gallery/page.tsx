"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Instagram, ArrowRight, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const galleryImages = [
    { id: 1, src: "/gallery/vaanra-1.jpg", user: "#vaanra_style", likes: "2.4k", link: "/products?category=t-shirts" },
    { id: 2, src: "/gallery/vaanra-2.jpg", user: "#street_vaanra", likes: "1.8k", link: "/products?category=hoodies" },
    { id: 3, src: "/gallery/vaanra-3.jpg", user: "#fashion_daily", likes: "3.2k", link: "/products?category=accessories" },
    { id: 4, src: "/gallery/vaanra-4.jpg", user: "#color_pop", likes: "4.1k", link: "/products?category=seasonal" },
    { id: 5, src: "/looks/vaanra-explorer.jpg", user: "#explorer_life", likes: "1.5k", link: "/products?collection=vaanra-explorer" },
    { id: 6, src: "/looks/coastal-vibe.jpg", user: "#beach_vibes", likes: "2.9k", link: "/products?collection=coastal-vibe" },
    // Duplicates for demo density
    { id: 7, src: "/gallery/vaanra-2.jpg", user: "#city_walker", likes: "1.2k", link: "/products?category=hoodies" },
    { id: 8, src: "/gallery/vaanra-1.jpg", user: "#minimal_me", likes: "5.6k", link: "/products?category=t-shirts" },
];

export default function GalleryPage() {
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-20">
            {/* Hero Section */}
            <section className="container mx-auto px-4 mb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto space-y-6"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-widest uppercase mb-4">
                        #VaanraFam
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tighter">
                        Wear It. Share It.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">
                            Be Iconic.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        Join 50,000+ creators styling Vaanra their way. Tag us on Instagram to be featured here!
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <Button className="h-12 px-8 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-lg hover:scale-105 transition-transform shadow-xl">
                            <Instagram className="w-5 h-5 mr-2" />
                            Follow @vaanra
                        </Button>
                        <Button variant="outline" className="h-12 px-8 rounded-full border-2 font-bold text-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:scale-105 transition-transform">
                            <Camera className="w-5 h-5 mr-2" />
                            Submit Look
                        </Button>
                    </div>
                </motion.div>
            </section>

            {/* Masonry Grid */}
            <section className="container mx-auto px-4">
                <div className="columns-1 md:columns-2 lg:columns-4 gap-6 space-y-6">
                    {galleryImages.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="break-inside-avoid"
                            onMouseEnter={() => setHoveredId(item.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <div className="relative group overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-800 shadow-md hover:shadow-2xl transition-all duration-500">
                                <Link href={item.link}>
                                    <div className="relative aspect-[3/4] w-full">
                                        <Image
                                            src={item.src}
                                            alt={`Gallery image by ${item.user}`}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Hover Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <div className="flex items-center justify-between text-white mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                                                        {item.user[1].toUpperCase()}
                                                    </div>
                                                    <span className="font-bold">{item.user}</span>
                                                </div>
                                                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                                                    <Heart className="w-3 h-3 fill-white" />
                                                    {item.likes}
                                                </div>
                                            </div>

                                            <div className="w-full py-3 bg-white text-black text-center font-bold text-sm rounded-full hover:bg-zinc-100 transition-colors">
                                                Shop This Look
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
