"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Instagram, Camera, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface InstaPost {
    id: string;
    image_url: string;
    caption: string;
    instagram_url: string;
    hashtag: string;
    likes: string;
}

// Fallback data
const fallbackImages: InstaPost[] = [
    { id: "1", image_url: "/gallery/vaanra-1.jpg", hashtag: "#vaanra_style", likes: "2.4k", instagram_url: "https://instagram.com/vaanra_store", caption: "" },
    { id: "2", image_url: "/gallery/vaanra-2.jpg", hashtag: "#street_vaanra", likes: "1.8k", instagram_url: "https://instagram.com/vaanra_store", caption: "" },
    { id: "3", image_url: "/gallery/vaanra-3.jpg", hashtag: "#fashion_daily", likes: "3.2k", instagram_url: "https://instagram.com/vaanra_store", caption: "" },
    { id: "4", image_url: "/gallery/vaanra-4.jpg", hashtag: "#color_pop", likes: "4.1k", instagram_url: "https://instagram.com/vaanra_store", caption: "" },
    { id: "5", image_url: "/looks/vaanra-explorer.jpg", hashtag: "#explorer_life", likes: "1.5k", instagram_url: "https://instagram.com/vaanra_store", caption: "" },
    { id: "6", image_url: "/looks/coastal-vibe.jpg", hashtag: "#beach_vibes", likes: "2.9k", instagram_url: "https://instagram.com/vaanra_store", caption: "" },
];

export default function GalleryPage() {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [posts, setPosts] = useState<InstaPost[]>(fallbackImages);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/instagram/feed?limit=20`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.posts && data.posts.length > 0) {
                        setPosts(data.posts);
                    }
                }
            } catch (error) {
                // Silently fall back to static content
            }
        };
        fetchPosts();
    }, []);

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
                        <Button
                            asChild
                            className="h-12 px-8 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-lg hover:scale-105 transition-transform shadow-xl"
                        >
                            <a href="https://instagram.com/vaanra_store" target="_blank" rel="noopener noreferrer">
                                <Instagram className="w-5 h-5 mr-2" />
                                Follow @vaanra_store
                            </a>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="h-12 px-8 rounded-full border-2 font-bold text-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:scale-105 transition-transform"
                        >
                            <a href="https://instagram.com/vaanra_store" target="_blank" rel="noopener noreferrer">
                                <Camera className="w-5 h-5 mr-2" />
                                Submit Look
                            </a>
                        </Button>
                    </div>
                </motion.div>
            </section>

            {/* Masonry Grid */}
            <section className="container mx-auto px-4">
                <div className="columns-1 md:columns-2 lg:columns-4 gap-6 space-y-6">
                    {posts.map((item, index) => (
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
                                <a
                                    href={item.instagram_url || "https://instagram.com/vaanra_store"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <div className="relative aspect-[3/4] w-full">
                                        <Image
                                            src={item.image_url}
                                            alt={item.caption || `Gallery image - ${item.hashtag}`}
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
                                                        V
                                                    </div>
                                                    <span className="font-bold">{item.hashtag || "@vaanra_store"}</span>
                                                </div>
                                                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                                                    <Heart className="w-3 h-3 fill-white" />
                                                    {item.likes}
                                                </div>
                                            </div>

                                            {item.caption && (
                                                <p className="text-white/80 text-sm mb-3 line-clamp-2">{item.caption}</p>
                                            )}

                                            <div className="w-full py-3 bg-white text-black text-center font-bold text-sm rounded-full hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2">
                                                <ExternalLink className="w-4 h-4" />
                                                View on Instagram
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
