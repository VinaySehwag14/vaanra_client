"use client";

import { useState } from "react";
import { Star, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductVariant } from "@/types/product";

interface ProductInfoProps {
    title: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    description: string;
    stock?: number;
    variants?: ProductVariant[];
}

export default function ProductInfo({
    title,
    price,
    originalPrice,
    rating,
    reviews,
    description,
    stock,
    variants = [],
}: ProductInfoProps) {
    // Extract unique colors and sizes from variants
    const variantColors = Array.from(
        new Set(variants.filter(v => v.color).map(v => v.color).filter((c): c is string => !!c))
    );
    const variantSizes = Array.from(
        new Set(variants.filter(v => v.size).map(v => v.size).filter((s): s is string => !!s))
    );

    // Fallback to default options if no variants
    const defaultColors = ["Black", "White", "Navy", "Blue"];
    const defaultSizes = ["S", "M", "L", "XL", "XXL"];

    const availableColors = variantColors.length > 0 ? variantColors : defaultColors;
    const availableSizes = variantSizes.length > 0 ? variantSizes : defaultSizes;

    const [selectedColor, setSelectedColor] = useState(availableColors[0] || "");
    const [selectedSize, setSelectedSize] = useState(availableSizes[0] || "");
    const [quantity, setQuantity] = useState(1);

    // Get stock for selected variant (only if variants exist)
    const selectedVariant = variants.length > 0 ? variants.find(
        v => v.color === selectedColor && v.size === selectedSize
    ) : undefined;
    const variantStock = selectedVariant?.stock ?? stock ?? 0;

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 md:text-4xl">
                    {title}
                </h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                            ${price.toFixed(2)}
                        </span>
                        {originalPrice && (
                            <span className="text-lg text-zinc-500 line-through dark:text-zinc-400">
                                ${originalPrice.toFixed(2)}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={cn(
                                    "h-4 w-4",
                                    i < Math.floor(rating)
                                        ? "fill-primary text-primary"
                                        : "fill-zinc-200 text-zinc-200 dark:fill-zinc-800 dark:text-zinc-800"
                                )}
                            />
                        ))}
                        <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">
                            ({reviews} reviews)
                        </span>
                    </div>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {variantStock > 0 ? `${variantStock} in stock` : "Out of stock"}
                </p>
            </div>

            {/* Color Selection */}
            {availableColors.length > 0 && (
                <div className="space-y-3">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        Color: <span className="text-zinc-500 dark:text-zinc-400">{selectedColor}</span>
                    </span>
                    <div className="flex gap-3">
                        {availableColors.map((color) => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={cn(
                                    "h-8 w-8 rounded-full ring-2 ring-transparent ring-offset-2 transition-all hover:scale-110 dark:ring-offset-zinc-950",
                                    getColorClass(color),
                                    selectedColor === color && "ring-primary"
                                )}
                                aria-label={`Select ${color}`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Size</span>
                        <button className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80">
                            <Ruler className="h-3 w-3" />
                            Size Guide
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {availableSizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={cn(
                                    "flex h-10 w-12 items-center justify-center rounded-md border text-sm font-medium transition-all",
                                    selectedSize === size
                                        ? "border-primary bg-primary/10 text-primary dark:text-primary"
                                        : "border-zinc-200 bg-transparent text-zinc-600 hover:border-primary hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-50 dark:hover:text-zinc-50"
                                )}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions - Buttons Side by Side */}
            <div className="flex flex-row gap-3">
                <Button
                    className="h-12 flex-1 rounded-full bg-primary text-base font-bold text-black hover:bg-primary/90"
                    disabled={variantStock === 0}
                >
                    Add to Cart
                </Button>
                <Button
                    variant="outline"
                    className="h-12 flex-1 rounded-full border-zinc-900 text-base font-bold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-900"
                    disabled={variantStock === 0}
                >
                    Buy Now
                </Button>
            </div>

            {/* Description */}
            <div className="space-y-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-50">Description</h3>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {description}
                </p>
                <ul className="list-inside list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                    <li>100% Premium Cotton</li>
                    <li>Relaxed, comfortable fit</li>
                    <li>Embroidered wave detail</li>
                    <li>Ribbed cuffs and hem</li>
                </ul>
            </div>
        </div>
    );
}

// Helper function to get color class based on color name
function getColorClass(color: string): string {
    const colorLower = color.toLowerCase();

    const colorMap: Record<string, string> = {
        black: "bg-black",
        white: "bg-white border border-zinc-200",
        navy: "bg-blue-900",
        blue: "bg-blue-500",
        red: "bg-red-500",
        green: "bg-green-500",
        yellow: "bg-yellow-400",
        pink: "bg-pink-500",
        purple: "bg-purple-500",
        gray: "bg-gray-500",
        grey: "bg-gray-500",
        orange: "bg-orange-500",
        brown: "bg-amber-700",
        beige: "bg-amber-200",
    };

    return colorMap[colorLower] || "bg-zinc-500";
}
