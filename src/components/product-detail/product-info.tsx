"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Ruler, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductVariant } from "@/types/product";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/hooks/useAuth";

interface ProductInfoProps {
    title: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    description: string;
    stock?: number;
    variants?: ProductVariant[];
    productId?: string | number;
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
    productId,
}: ProductInfoProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { addToCart, isLoading: cartLoading } = useCart();

    // Local loading states
    const [addingToCart, setAddingToCart] = useState(false);
    const [buyingNow, setBuyingNow] = useState(false);

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
    // Use stock_quantity (new API) or stock (legacy) or fallback to component stock prop
    const variantStock = selectedVariant?.stock_quantity ?? selectedVariant?.stock ?? stock ?? 0;

    // Handle Add to Cart
    const handleAddToCart = async () => {
        if (!user) {
            router.push("/login");
            return;
        }

        if (!selectedVariant?.id) {
            alert("Please select a valid variant");
            return;
        }

        setAddingToCart(true);
        try {
            const variantId = typeof selectedVariant.id === "string"
                ? parseInt(selectedVariant.id, 10)
                : selectedVariant.id;

            const success = await addToCart(variantId, quantity);
            if (success) {
                // Show success feedback (could use toast here)
                alert("Added to cart!");
            }
        } catch (error) {
            console.error("Failed to add to cart:", error);
            alert("Failed to add to cart. Please try again.");
        } finally {
            setAddingToCart(false);
        }
    };

    // Handle Buy Now
    const handleBuyNow = async () => {
        if (!user) {
            router.push("/login");
            return;
        }

        if (!selectedVariant?.id) {
            alert("Please select a valid variant");
            return;
        }

        setBuyingNow(true);
        try {
            const variantId = typeof selectedVariant.id === "string"
                ? parseInt(selectedVariant.id, 10)
                : selectedVariant.id;

            const success = await addToCart(variantId, quantity);
            if (success) {
                router.push("/checkout");
            }
        } catch (error) {
            console.error("Failed to add to cart:", error);
            alert("Failed to add to cart. Please try again.");
        } finally {
            setBuyingNow(false);
        }
    };

    const isButtonDisabled = variantStock === 0 || addingToCart || buyingNow || cartLoading;

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
                            ₹{price.toFixed(2)}
                        </span>
                        {originalPrice && (
                            <span className="text-lg text-zinc-500 line-through dark:text-zinc-400">
                                ₹{originalPrice.toFixed(2)}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium">{rating}</span>
                        <span>({reviews} reviews)</span>
                    </div>
                </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900 dark:text-zinc-50">
                        Color: {selectedColor}
                    </span>
                </div>
                <div className="flex gap-2">
                    {availableColors.map((color) => {
                        // Check if this color has available stock (when used with selected size)
                        const colorVariant = variants.find(
                            v => v.color === color && v.size === selectedSize
                        );
                        const isAvailable = !colorVariant || (colorVariant.stock_quantity ?? colorVariant.stock ?? 0) > 0;

                        return (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                disabled={!isAvailable}
                                className={cn(
                                    "h-10 min-w-10 rounded-full border-2 px-3 text-xs font-medium transition-all",
                                    selectedColor === color
                                        ? "border-primary bg-primary/10"
                                        : "border-zinc-200 dark:border-zinc-700",
                                    !isAvailable && "opacity-50 cursor-not-allowed line-through"
                                )}
                            >
                                {color}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900 dark:text-zinc-50">
                        Size: {selectedSize}
                    </span>
                    <button className="flex items-center gap-1 text-sm text-primary hover:underline">
                        <Ruler className="h-4 w-4" />
                        Size Guide
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => {
                        // Check if this size has available stock (when used with selected color)
                        const sizeVariant = variants.find(
                            v => v.size === size && v.color === selectedColor
                        );
                        const isAvailable = !sizeVariant || (sizeVariant.stock_quantity ?? sizeVariant.stock ?? 0) > 0;

                        return (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                disabled={!isAvailable}
                                className={cn(
                                    "flex h-11 min-w-11 items-center justify-center rounded-lg border-2 text-sm font-bold transition-all",
                                    selectedSize === size
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-zinc-200 text-zinc-900 dark:border-zinc-700 dark:text-zinc-50",
                                    !isAvailable && "opacity-50 cursor-not-allowed line-through"
                                )}
                            >
                                {size}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Stock Status */}
            {variants.length > 0 && (
                <div className="text-sm">
                    {variantStock > 0 ? (
                        <span className={cn(
                            "font-medium",
                            variantStock <= 5 ? "text-amber-600" : "text-green-600"
                        )}>
                            {variantStock <= 5 ? `Only ${variantStock} left!` : `${variantStock} in stock`}
                        </span>
                    ) : (
                        <span className="font-medium text-red-600">Out of stock</span>
                    )}
                </div>
            )}

            {/* Actions - Buttons Side by Side */}
            <div className="flex flex-row gap-3">
                <Button
                    onClick={handleAddToCart}
                    className="h-12 flex-1 rounded-full bg-primary text-base font-bold text-black hover:bg-primary/90"
                    disabled={isButtonDisabled}
                >
                    {addingToCart ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                        </>
                    ) : (
                        "Add to Cart"
                    )}
                </Button>
                <Button
                    onClick={handleBuyNow}
                    variant="outline"
                    className="h-12 flex-1 rounded-full border-zinc-900 text-base font-bold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-900"
                    disabled={isButtonDisabled}
                >
                    {buyingNow ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Buy Now"
                    )}
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
