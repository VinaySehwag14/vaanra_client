"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ApiClient } from "@/lib/api-client";
import { Category as ApiCategory } from "@/types/category";

interface Category {
    id: string;
    name: string;
    image: string;
    imageAlt: string;
    link: string;
}

export default function ShopByCategory() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await ApiClient.getCategories();

                // Map API response to component format
                const mappedCategories: Category[] = response.categories.map((cat: ApiCategory) => ({
                    id: cat.id,
                    name: cat.name,
                    image: cat.image_url || cat.image || "/gallery/vaanra-1.jpg",
                    imageAlt: `${cat.name} Category`,
                    link: `/products?category=${cat.name.toLowerCase().replace(/\s+/g, '-')}`,
                }));

                setCategories(mappedCategories);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                setError("Failed to load categories");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (error || (categories.length === 0 && !loading)) return null;

    return (
        <section className="w-full py-[10px]">
            <div className="container mx-auto px-4">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-2xl">
                        <span className="text-primary font-bold tracking-wider uppercase text-xs md:text-sm mb-3 block flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-primary"></span>
                            Curated Collections
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white leading-[0.9]">
                            SHOP BY <br className="hidden md:block" />
                            <span className="text-zinc-400">CATEGORY</span>
                        </h2>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 max-w-xs text-base md:text-lg font-medium leading-relaxed border-l-2 border-zinc-200 dark:border-zinc-800 pl-4 md:mb-2">
                        Explore our wide range of premium apparel designed for the modern urban lifestyle.
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-[3/4] rounded-[2rem] bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                    >
                        {categories.map((category) => (
                            <motion.div key={category.id} variants={item}>
                                <Link
                                    href={category.link}
                                    className="group relative block aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-zinc-100 dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-all duration-500"
                                >
                                    <Image
                                        src={category.image}
                                        alt={category.imageAlt}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 opacity-60 group-hover:opacity-80" />

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 w-full p-6">
                                        <div className="flex items-end justify-between translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white break-words max-w-[80%]">
                                                {category.name}
                                            </h3>

                                            {/* Hover Button */}
                                            <div className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-lg">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M7 7h10v10" />
                                                    <path d="M7 17 17 7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="w-full h-[1px] bg-white/30 mt-4 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
