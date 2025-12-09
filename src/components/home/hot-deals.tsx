"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ApiClient } from "@/lib/api-client";
import { ApiProduct } from "@/types/product";

interface DealCategory {
    id: string;
    title: string;
    discount: string;
    image: string;
    imageAlt: string;
    link: string;
}

export default function HotDeals() {
    const [deals, setDeals] = useState<DealCategory[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                setError(null);

                // Fetch products on sale
                const response = await ApiClient.getProducts({ onSale: true, limit: 50 });

                // Group products by category
                const categoryMap = new Map<string, ApiProduct[]>();
                response.products.forEach((product: ApiProduct) => {
                    const category = product.category_name || "Other";
                    if (!categoryMap.has(category)) {
                        categoryMap.set(category, []);
                    }
                    categoryMap.get(category)!.push(product);
                });

                // Create deal categories from grouped products
                const dealCategories: DealCategory[] = Array.from(categoryMap.entries())
                    .slice(0, 6) // Limit to 6 categories
                    .map(([categoryName, products], index) => {
                        // Calculate average discount
                        const avgDiscount = products.reduce((sum, p) =>
                            sum + (p.discount_percentage || 0), 0) / products.length;

                        // Get primary image (sort_order 1) or first image
                        let imageUrl = "/placeholder-product.jpg";
                        if (products[0].images && products[0].images.length > 0) {
                            const primaryImage = products[0].images.find(img => img.sort_order === 1);
                            if (primaryImage && primaryImage.url) {
                                imageUrl = primaryImage.url;
                            } else if (products[0].images[0] && products[0].images[0].url) {
                                imageUrl = products[0].images[0].url;
                            }
                        }

                        return {
                            id: `${index + 1}`,
                            title: categoryName.toUpperCase(),
                            discount: avgDiscount > 0
                                ? `UP TO ${Math.round(avgDiscount)}% OFF`
                                : "ON SALE",
                            image: imageUrl,
                            imageAlt: `${categoryName} Deal`,
                            link: `/products?category=${categoryName.toLowerCase().replace(/\s+/g, '-')}&sale=true`,
                        };
                    });

                setDeals(dealCategories);
            } catch (err) {
                console.error("Failed to fetch deals:", err);
                setError("Failed to load deals");
            }
        };

        fetchDeals();
    }, []);

    return (
        <section className="w-full">
            {/* Header */}
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-3xl lg:text-4xl">
                    SHOP OUR HOT DEALS
                </h2>
            </div>

            {/* Error State */}
            {error && (
                <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 p-6 text-center">
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            {/* Empty State */}
            {!error && deals.length === 0 && (
                <div className="rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-6 text-center">
                    <p className="text-zinc-600 dark:text-zinc-400">No deals available</p>
                </div>
            )}

            {/* Deals Grid */}
            {!error && deals.length > 0 && (
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-6 md:pb-0 scrollbar-hide">
                    {deals.map((deal) => (
                        <Link
                            key={deal.id}
                            href={deal.link}
                            className="group relative aspect-[3/4] w-[60%] shrink-0 snap-center overflow-hidden rounded-2xl bg-zinc-900 shadow-md transition-all duration-300 hover:shadow-xl sm:w-[40%] md:w-auto"
                        >
                            {/* Image */}
                            <Image
                                src={deal.image}
                                alt={deal.imageAlt}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                                <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-zinc-300 md:text-xs">
                                    {deal.title}
                                </h3>
                                <p className="text-lg font-black tracking-tight text-primary md:text-xl">
                                    {deal.discount}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}
