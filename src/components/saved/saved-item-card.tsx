"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { SavedItem } from "@/types/saved-item";
import { cn } from "@/lib/utils";

interface SavedItemCardProps {
    item: SavedItem;
    onRemove: (id: string) => void;
    onAddToCart: (id: string) => void;
}

export default function SavedItemCard({
    item,
    onRemove,
    onAddToCart,
}: SavedItemCardProps) {
    const [isRemoving, setIsRemoving] = useState(false);

    const handleRemove = () => {
        setIsRemoving(true);
        setTimeout(() => onRemove(item.id), 300);
    };

    return (
        <div
            className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-100 transition-all duration-300 dark:bg-zinc-800",
                isRemoving && "scale-95 opacity-0"
            )}
        >
            {/* Heart Icon */}
            <button
                onClick={handleRemove}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:scale-110 dark:bg-zinc-900/90 dark:hover:bg-zinc-900"
                aria-label="Remove from saved items"
            >
                <Heart className="h-4 w-4 fill-current" />
            </button>

            {/* Product Image */}
            <Link href={`/products/${item.id}`} className="relative aspect-square">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </Link>

            {/* Product Info */}
            <div className="flex flex-col gap-3 p-4">
                <div className="flex-1">
                    <Link href={`/products/${item.id}`}>
                        <h3 className="font-bold text-zinc-900 line-clamp-1 dark:text-zinc-50">
                            {item.name}
                        </h3>
                    </Link>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {item.category}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                        ₹{item.price.toFixed(2)}
                    </span>

                    <button
                        onClick={() => onAddToCart(item.id)}
                        disabled={!item.inStock}
                        className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                            item.inStock
                                ? "bg-primary text-black hover:bg-primary/90"
                                : "bg-zinc-300 text-zinc-500 cursor-not-allowed dark:bg-zinc-700 dark:text-zinc-500"
                        )}
                        aria-label="Add to cart"
                    >
                        <ShoppingBag className="h-5 w-5" />
                    </button>
                </div>

                {!item.inStock && (
                    <p className="text-xs text-red-600 dark:text-red-400">Out of Stock</p>
                )}
            </div>
        </div>
    );
}
