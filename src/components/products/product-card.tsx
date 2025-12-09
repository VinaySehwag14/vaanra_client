"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Product } from "@/types/product";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/products/${product.slug}`} className="group block">
            <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                {/* Product Image */}
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Badge */}
                {product.badge && (
                    <div
                        className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-black ${product.badge.color === "new"
                            ? "bg-yellow-400"
                            : product.badge.color === "sale"
                                ? "bg-primary"
                                : "bg-red-500 text-white"
                            }`}
                    >
                        {product.badge.text}
                    </div>
                )}

                {/* Wishlist Button */}
                <button className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-zinc-900 opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-white group-hover:opacity-100">
                    <Heart className="h-5 w-5" />
                </button>
            </div>

            {/* Content */}
            <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                    {product.title}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary dark:text-primary">
                        ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                        <span className="text-sm text-zinc-500 line-through dark:text-zinc-400">
                            ${product.originalPrice.toFixed(2)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
