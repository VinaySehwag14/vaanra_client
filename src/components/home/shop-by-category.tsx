"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
    const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

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
                    image: cat.image || "/placeholder-product.jpg", // Fallback to avoid empty src error
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

    // Intersection observer for animations
    useEffect(() => {
        if (categories.length === 0) return;

        const observers: IntersectionObserver[] = [];

        itemRefs.current.forEach((ref, index) => {
            if (!ref) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setVisibleItems((prev) => new Set(prev).add(index));
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: "0px 0px -50px 0px",
                }
            );

            observer.observe(ref);
            observers.push(observer);
        });

        return () => {
            observers.forEach((observer) => observer.disconnect());
        };
    }, [categories]);

    return (
        <section className="w-full">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 md:text-3xl">
                    Shop By Category
                </h2>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-4 md:gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="aspect-[4/5] w-[70%] shrink-0 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800 sm:w-[45%] md:w-auto"
                        />
                    ))}
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 p-6 text-center">
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                    <p className="text-sm text-red-500 dark:text-red-500 mt-2">Please try again later</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && categories.length === 0 && (
                <div className="rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-6 text-center">
                    <p className="text-zinc-600 dark:text-zinc-400">No categories available</p>
                </div>
            )}

            {/* Categories Grid */}
            {!loading && !error && categories.length > 0 && (
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:gap-6 md:pb-0 scrollbar-hide">
                    {categories.map((category, index) => (
                        <Link
                            key={category.id}
                            href={category.link}
                            ref={(el) => {
                                itemRefs.current[index] = el;
                            }}
                            className="group relative aspect-[4/5] w-[70%] shrink-0 snap-center overflow-hidden rounded-2xl bg-zinc-900 shadow-md transition-all duration-300 hover:shadow-xl sm:w-[45%] md:w-auto"
                            style={{
                                opacity: visibleItems.has(index) ? 1 : 0,
                                transform: visibleItems.has(index)
                                    ? "translateY(0)"
                                    : "translateY(30px)",
                                transition: `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`,
                            }}
                        >
                            {/* Background Image */}
                            <Image
                                src={category.image}
                                alt={category.imageAlt}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                            {/* Category Name */}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="text-lg font-bold text-white md:text-xl">
                                    {category.name}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}
