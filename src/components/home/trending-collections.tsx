"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";

interface Collection {
    id: number;
    title: string;
    description: string;
    image: string;
    link: string;
    stats: string;
    color: string;
    className: string;
}

const collections: Collection[] = [
    {
        id: 1,
        title: "Vaanra Nomad",
        description: "Street-smart essentials.",
        image: "/gallery/vaanra-2.jpg",
        link: "/products?collection=vaanra-nomad",
        stats: "Trending #1",
        color: "bg-orange-500",
        className: "md:col-span-2"
    },
    {
        id: 2,
        title: "Coastal Cool",
        description: "Breezy fits for summer.",
        image: "/looks/coastal-vibe.jpg",
        link: "/products?collection=coastal-cool",
        stats: "Fast Selling",
        color: "bg-blue-500",
        className: "md:col-span-1"
    },
    {
        id: 3,
        title: "Monochrome",
        description: "Timeless black & white.",
        image: "/carousel/summer-edit.jpg",
        link: "/products?collection=monochrome",
        stats: "Editor's Pick",
        color: "bg-zinc-900",
        className: "md:col-span-1"
    },
    {
        id: 4,
        title: "Athleisure",
        description: "Performance meets style.",
        image: "/gallery/vaanra-1.jpg",
        link: "/products?collection=athleisure",
        stats: "High Demand",
        color: "bg-green-500",
        className: "md:col-span-1"
    },
    {
        id: 5,
        title: "Y2K Aesthetic",
        description: "Retro-future looks.",
        image: "/gallery/vaanra-4.jpg",
        link: "/products?collection=y2k",
        stats: "Viral",
        color: "bg-pink-500",
        className: "md:col-span-1"
    },
    {
        id: 6,
        title: "Night Luxe",
        description: "After-hours fits.",
        image: "/gallery/vaanra-3.jpg",
        link: "/products?collection=night-luxe",
        stats: "New Arrival",
        color: "bg-purple-500",
        className: "md:col-span-2"
    }
];

export default function TrendingCollections() {
    return (
        <section className="w-full py-16 box-border">
            <div className="container mx-auto px-4 mb-10">
                <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-5 h-5 text-red-500" />
                            <span className="text-sm font-bold tracking-widest uppercase text-red-500">What's Trending</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white leading-[0.9]">
                            Curated <span className="text-zinc-400">Collections</span>
                        </h2>
                    </div>
                    <div className="flex flex-col items-end">
                        <p className="text-zinc-500 font-medium max-w-sm text-sm md:text-base leading-relaxed md:text-right mb-4">
                            Explore the hottest drops and viral styles taking over the streets right now.
                        </p>
                        <Link href="/products" className="group flex items-center gap-2 text-sm font-bold border-b-2 border-zinc-900 dark:border-white pb-0.5 hover:text-primary hover:border-primary transition-all">
                            View All Collections <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {collections.map((collection) => (
                        <Link
                            key={collection.id}
                            href={collection.link}
                            className={`group relative block w-full h-[320px] overflow-hidden rounded-[2rem] bg-zinc-100 shadow-md hover:shadow-xl transition-all duration-500 ${collection.className}`}
                        >
                            <Image
                                src={collection.image}
                                alt={collection.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                            <div className={`absolute top-5 left-5 ${collection.color} text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg transform group-hover:-translate-y-1 transition-transform`}>
                                {collection.stats}
                            </div>

                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                <h3 className="text-2xl font-black text-white uppercase italic leading-none mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    {collection.title}
                                </h3>
                                <p className="text-white/90 text-xs font-medium mb-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 line-clamp-2 max-w-[90%]">
                                    {collection.description}
                                </p>
                                <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                                    <ArrowUpRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
