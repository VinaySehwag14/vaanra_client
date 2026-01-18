"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

const savedItems = [
    {
        id: 1,
        name: "Desert Wave Tee",
        image: "/carousel/summer-edit.jpg",
        href: "/products/1",
    },
    {
        id: 2,
        name: "Minimal Crewneck",
        image: "/looks/coastal-vibe.jpg",
        href: "/products/2",
    },
    {
        id: 3,
        name: "Oceanic Hoodie",
        image: "/gallery/vaanra-2.jpg",
        href: "/products/3",
    },
    {
        id: 4,
        name: "Sunbeam Beanie",
        image: "/gallery/vaanra-1.jpg",
        href: "/products/4",
    },
    {
        id: 5,
        name: "Vortex Socks",
        image: "/carousel/winter-collection.jpg",
        href: "/products/5",
    },
];

export default function SavedItems() {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    Saved Items
                </h2>
                <Link
                    href="/profile/saved"
                    className="text-sm font-medium text-primary hover:text-primary/80"
                >
                    View Wishlist
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {savedItems.map((item) => (
                    <Link
                        key={item.id}
                        href={item.href}
                        className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800"
                    >
                        <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="absolute bottom-2 left-2 right-2 translate-y-2 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                            <p className="text-xs font-medium text-white line-clamp-1">
                                {item.name}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
