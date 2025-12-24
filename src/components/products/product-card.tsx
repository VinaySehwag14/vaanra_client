"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import StockIndicator from "./stock-indicator";
import TrendingBadge from "./trending-badge";

interface ProductCardProps {
    product: Product;
    index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);

    // Mock data for FOMO elements (in real app, this would come from API)
    const mockStock = Math.floor(Math.random() * 20) + 1;
    const mockViewers = Math.floor(Math.random() * 200) + 50;
    const isTrending = Math.random() > 0.7;
    const isHot = Math.random() > 0.8;
    const rating = 4.5;
    const reviewCount = Math.floor(Math.random() * 500) + 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative block h-full"
        >
            <Link href={`/products/${product.slug}`} className="block">
                <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-[2rem] bg-neutral-100 dark:bg-neutral-900 shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    {/* Product Image */}
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Top Badges Row */}
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2 pointer-events-none">
                        {/* Original Badge */}
                        {product.badge && (
                            <div
                                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${product.badge.color === "new"
                                        ? "bg-black text-white"
                                        : product.badge.color === "sale"
                                            ? "bg-primary text-black"
                                            : "bg-red-500 text-white"
                                    }`}
                            >
                                {product.badge.text}
                            </div>
                        )}

                        {/* Trending Badge */}
                        {isTrending && <TrendingBadge type="trending" />}
                        {isHot && <TrendingBadge type="hot" />}
                    </div>

                    {/* Viewer Count Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1.5 backdrop-blur-md pointer-events-none"
                    >
                        <Eye className="h-3 w-3 text-white" />
                        <span className="text-[10px] font-bold text-white">{mockViewers}</span>
                    </motion.div>

                    {/* Wishlist Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsWishlisted(!isWishlisted);
                        }}
                        className={`absolute right-4 top-14 rounded-full p-2.5 shadow-lg transition-all duration-300 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 z-10 pointer-events-auto ${isWishlisted
                                ? "bg-red-500 text-white"
                                : "bg-white/90 text-zinc-900 hover:bg-primary"
                            }`}
                    >
                        <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                    </motion.button>

                    {/* Stock Indicator */}
                    {mockStock <= 15 && (
                        <div className="absolute bottom-16 left-4 right-4 opacity-0 transition-all duration-300 group-hover:opacity-100 pointer-events-none">
                            <StockIndicator stock={mockStock} />
                        </div>
                    )}

                    {/* Quick Add Button */}
                    <div className="absolute bottom-4 left-4 right-4 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 pointer-events-auto">
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Add to cart logic here
                            }}
                            className="w-full rounded-xl bg-white/95 text-black hover:bg-white backdrop-blur-md shadow-lg font-semibold h-11 border-2 border-transparent hover:border-primary transition-all"
                        >
                            <ShoppingBag className="mr-2 h-4 w-4" /> Quick Add
                        </Button>
                    </div>

                    {/* Recent Purchase Notification (appears randomly) */}
                    {Math.random() > 0.7 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 + index * 0.1 }}
                            className="absolute bottom-4 left-4 right-4 rounded-lg bg-green-500/90 px-3 py-2 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        >
                            <p className="text-[10px] font-bold text-white">
                                🔥 {Math.floor(Math.random() * 10) + 1} sold in last 24h
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Content */}
                <div className="space-y-2 px-2">
                    <h3 className="text-base font-bold text-foreground line-clamp-1 hover:text-primary transition-colors">
                        {product.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < Math.floor(rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                            ({reviewCount})
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                            ₹{product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                            <>
                                <span className="text-sm text-muted-foreground line-through decoration-muted-foreground/50">
                                    ₹{product.originalPrice.toFixed(2)}
                                </span>
                                <span className="rounded-full bg-red-100 dark:bg-red-950 px-2 py-0.5 text-xs font-bold text-red-600 dark:text-red-400">
                                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                </span>
                            </>
                        )}
                    </div>

                    {/* Stock Warning (visible without hover for urgency) */}
                    {mockStock <= 5 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="h-1.5 w-1.5 rounded-full bg-red-500"
                            />
                            Almost Gone!
                        </motion.div>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}
