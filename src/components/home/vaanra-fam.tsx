"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Instagram } from "lucide-react";

interface InstaPost {
    id: string;
    image_url: string;
    caption: string;
    instagram_url: string;
    hashtag: string;
    likes: string;
    display_order: number;
}

// Fallback data if API is not available
const fallbackImages = [
    { id: "f1", image_url: "/gallery/vaanra-1.jpg", hashtag: "#vaanra_style", likes: "2.4k", instagram_url: "https://instagram.com/vaanra_store", caption: "" },
    { id: "f2", image_url: "/gallery/vaanra-2.jpg", hashtag: "#street_vaanra", likes: "1.8k", instagram_url: "https://instagram.com/vaanra_store", caption: "" },
    { id: "f3", image_url: "/gallery/vaanra-3.jpg", hashtag: "#fashion_daily", likes: "3.2k", instagram_url: "https://instagram.com/vaanra_store", caption: "" },
    { id: "f4", image_url: "/gallery/vaanra-4.jpg", hashtag: "#color_pop", likes: "4.1k", instagram_url: "https://instagram.com/vaanra_store", caption: "" },
    { id: "f5", image_url: "/looks/vaanra-explorer.jpg", hashtag: "#explorer_life", likes: "1.5k", instagram_url: "https://instagram.com/vaanra_store", caption: "" },
];

export default function VaanraFam() {
    const [posts, setPosts] = useState<InstaPost[]>(fallbackImages as InstaPost[]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/instagram/feed?limit=10`);
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

    // Duplicate for infinite loop marquee
    const marqueeImages = [...posts, ...posts, ...posts];

    return (
        <section className="w-full py-16 border-t border-zinc-100 dark:border-zinc-900 overflow-hidden relative bg-zinc-50/50 dark:bg-zinc-950/50">
            {/* Background Blur Elements */}
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-zinc-50 dark:from-zinc-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-zinc-50 dark:from-zinc-950 to-transparent z-10 pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 mb-12 flex flex-col md:flex-row items-end justify-between gap-6 relative z-20">
                <div>
                    <span className="text-primary font-bold tracking-wider uppercase text-xs md:text-sm mb-2 block flex items-center gap-2">
                        <span className="w-8 h-[2px] bg-primary"></span>
                        Join The Movement
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none">
                        #VaanraFam
                    </h2>
                </div>

                <Link
                    href="https://instagram.com/vaanra_store"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 rounded-full bg-black px-8 py-3.5 font-bold text-white text-sm md:text-base transition-all hover:bg-primary hover:scale-105 active:scale-95 dark:bg-white dark:text-black shadow-lg"
                >
                    <Instagram className="w-5 h-5" />
                    <span>Follow @vaanra_store</span>
                </Link>
            </div>

            {/* Marquee Row */}
            <div className="w-full relative">
                {/* CSS Animation Styles */}
                <style jsx global>{`
                    @keyframes marquee {
                        0% { transform: translateX(0%); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-marquee {
                        animation: marquee 40s linear infinite;
                    }
                    .animate-marquee:hover {
                        animation-play-state: paused;
                    }
                `}</style>

                <div className="flex gap-6 w-max pl-4 animate-marquee">
                    {marqueeImages.map((item, index) => (
                        <a
                            key={`${item.id}-${index}`}
                            href={item.instagram_url || "https://instagram.com/vaanra_store"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative h-[340px] w-[250px] shrink-0 overflow-hidden rounded-[2rem] bg-zinc-200 dark:bg-zinc-800 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                        >
                            <Image
                                src={item.image_url}
                                alt={item.caption || `Post by @vaanra_store`}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, 300px"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 opacity-60 group-hover:opacity-90" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <div className="flex items-center justify-between text-white mb-4">
                                    <span className="font-bold text-sm bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                        {item.hashtag || "@vaanra_store"}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-xs font-bold bg-black/30 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/10">
                                        <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                                        {item.likes}
                                    </div>
                                </div>
                                <div className="w-full py-3 bg-white text-black text-center font-bold text-xs uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100 shadow-lg">
                                    View on Instagram
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
