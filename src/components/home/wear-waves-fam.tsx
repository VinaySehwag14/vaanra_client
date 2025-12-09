"use client";

import Image from "next/image";
import Link from "next/link";

interface GalleryImage {
    id: number;
    image: string;
    imageAlt: string;
    link: string;
}

const galleryImages: GalleryImage[] = [
    {
        id: 1,
        image: "/gallery/wear-waves-1.jpg",
        imageAlt: "Beige matching set outfit",
        link: "/products?style=matching-sets",
    },
    {
        id: 2,
        image: "/gallery/wear-waves-2.jpg",
        imageAlt: "Urban streetwear outfit",
        link: "/products?style=streetwear",
    },
    {
        id: 3,
        image: "/gallery/wear-waves-3.jpg",
        imageAlt: "Light blue hoodie style",
        link: "/products?category=hoodies",
    },
    {
        id: 4,
        image: "/gallery/wear-waves-4.jpg",
        imageAlt: "Yellow hoodie on pink background",
        link: "/products?color=yellow",
    },
];

export default function WearWavesFam() {
    return (
        <section className="w-full">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 md:text-3xl lg:text-4xl">
                    #WearWaves Fam
                </h2>
                <Link
                    href="/gallery"
                    className="rounded-full border-2 border-zinc-900 bg-transparent px-6 py-2 text-sm font-semibold text-zinc-900 transition-all duration-300 hover:bg-zinc-900 hover:text-white dark:border-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-50 dark:hover:text-zinc-900"
                >
                    View Gallery
                </Link>
            </div>

            {/* Gallery Grid */}
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:gap-6 md:pb-0 scrollbar-hide">
                {galleryImages.map((item) => (
                    <Link
                        key={item.id}
                        href={item.link}
                        className="group relative aspect-[3/4] w-[60%] shrink-0 snap-center overflow-hidden rounded-2xl bg-zinc-100 shadow-md transition-all duration-300 hover:shadow-xl dark:bg-zinc-800 sm:w-[45%] md:w-auto"
                    >
                        <Image
                            src={item.image}
                            alt={item.imageAlt}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Subtle overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/10" />
                    </Link>
                ))}
            </div>
        </section>
    );
}
