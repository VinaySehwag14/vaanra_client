"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Loader2, Heart, Truck, ShieldCheck, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductVariant } from "@/types/product";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/cart-context";

const COLOR_MAP: Record<string, string> = {
    "black": "#000000",
    "white": "#FFFFFF",
    "navy": "#1a365d",
    "blue": "#3182ce",
    "red": "#e53e3e",
    "green": "#38a169",
    "gray": "#718096",
    "grey": "#718096",
    "beige": "#F5F5DC",
    "cream": "#FFFDD0",
    "sand": "#C2B280",
    "sandstone": "#786D5F",
    "olive": "#808000",
    "maroon": "#800000",
    "brown": "#8B4513",
    "tan": "#D2B48C",
    "khaki": "#F0E68C",
    "charcoal": "#36454F",
    "burgundy": "#800020",
    "teal": "#008080",
    "forest green": "#228B22",
    "sea green": "#2E8B57",
};

interface ProductInfoProps {
    title: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    description: string;
    stock: number;
    variants: ProductVariant[];
}

export default function ProductInfo({
    title,
    price,
    originalPrice,
    rating,
    reviews,
    description,
    stock,
    variants
}: ProductInfoProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { addToCart, isLoading: cartLoading } = useCart();

    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [addingToCart, setAddingToCart] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    // Extract unique colors and sizes
    const variantColors = Array.from(new Set(variants.filter(v => v.color).map(v => v.color).filter((c): c is string => !!c)));
    const variantSizes = Array.from(new Set(variants.filter(v => v.size).map(v => v.size).filter((s): s is string => !!s)));

    // Filter available sizes based on selected color
    const availableSizes = selectedColor
        ? variants.filter(v => v.color === selectedColor && v.size).map(v => v.size).filter((s): s is string => !!s)
        : variantSizes;

    // Filter available colors based on selected size
    const availableColors = selectedSize
        ? variants.filter(v => v.size === selectedSize && v.color).map(v => v.color).filter((c): c is string => !!c)
        : variantColors;

    // Auto-select first available options
    useEffect(() => {
        if (variantColors.length > 0 && !selectedColor) {
            setSelectedColor(variantColors[0]);
        }
        if (variantSizes.length > 0 && !selectedSize) {
            setSelectedSize(variantSizes[0]);
        }
    }, [variantColors, variantSizes, selectedColor, selectedSize]);

    // Get current variant info
    const selectedVariant = variants.length > 0 ? variants.find(v => v.color === selectedColor && v.size === selectedSize) : undefined;
    const variantStock = selectedVariant?.stock_quantity ?? selectedVariant?.stock ?? stock ?? 0;

    const handleAddToCart = async () => {
        if (!user) return router.push("/login");

        setAddingToCart(true);
        try {
            const variantId = typeof selectedVariant?.id === "string" ? parseInt(selectedVariant.id, 10) : selectedVariant?.id || 0;
            await addToCart(variantId, 1);
        } catch (error) {
            console.error("Failed to add to cart:", error);
        } finally {
            setAddingToCart(false);
        }
    };

    const isButtonDisabled = variantStock === 0 || addingToCart || cartLoading;
    const discountPercent = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Header: Title & Wishlist */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
                        {title ? title.split(' ').slice(0, -1).join(' ') : ''}
                        <span className="block text-primary">{title ? title.split(' ').slice(-1) : ''}</span>
                    </h1>
                </div>
                <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all border",
                        isWishlisted
                            ? "bg-red-50 border-red-200 text-red-500"
                            : "bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600"
                    )}
                >
                    <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
                </button>
            </div>

            {/* Price */}
            <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-900">₹{price.toLocaleString('en-IN')}</span>
                    {originalPrice && discountPercent > 0 && (
                        <span className="text-lg text-gray-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                    )}
                    {discountPercent > 0 && (
                        <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                            {discountPercent}% OFF
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-500">Inclusive of all taxes. Shipping calculated at checkout.</p>
            </div>

            {/* Description Card */}
            {description && (
                <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                            <span className="text-xs">✧</span>
                        </div>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">The Human Touch</span>
                    </div>
                    <p className="text-sm text-gray-600 italic leading-relaxed">
                        &ldquo;{description.length > 200 ? description.slice(0, 200) + '...' : description}&rdquo;
                    </p>
                </div>
            )}

            {/* Color Selection */}
            {availableColors.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Color:</span>
                        <span className="text-sm text-gray-900 capitalize">{selectedColor}</span>
                    </div>
                    <div className="flex gap-3">
                        {availableColors.map((color) => {
                            const isSelected = selectedColor === color;
                            const hexColor = COLOR_MAP[color.toLowerCase()] || "#888888";
                            const isLight = ['#FFFFFF', '#FFFDD0', '#F5F5DC'].includes(hexColor.toUpperCase());

                            return (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={cn(
                                        "w-10 h-10 rounded-full transition-all duration-200",
                                        isSelected
                                            ? "ring-2 ring-offset-2 ring-primary"
                                            : "hover:scale-110"
                                    )}
                                    style={{ backgroundColor: hexColor }}
                                    title={color}
                                >
                                    {isLight && (
                                        <span className="w-full h-full rounded-full border border-gray-200 block" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Size</span>
                        <button className="text-sm text-primary hover:underline flex items-center gap-1">
                            <Ruler className="w-4 h-4" />
                            Size Guide
                        </button>
                    </div>
                    <div className="flex gap-2">
                        {availableSizes.map((size) => {
                            const isSelected = selectedSize === size;
                            return (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={cn(
                                        "min-w-[4rem] h-11 px-4 rounded-lg border text-sm font-medium transition-all duration-200",
                                        isSelected
                                            ? "bg-primary border-primary text-white"
                                            : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
                                    )}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Stock Warning */}
            {variantStock > 0 && variantStock < 10 && (
                <div className="flex items-center gap-2 text-amber-600 text-sm">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Only {variantStock} left in stock
                </div>
            )}

            {/* Add to Bag Button */}
            <Button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className="w-full h-14 rounded-lg text-base font-bold bg-primary hover:bg-primary/90 text-white transition-all shadow-lg shadow-primary/20"
            >
                {addingToCart ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : variantStock === 0 ? (
                    "Out of Stock"
                ) : (
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5" />
                        <span>ADD TO BAG</span>
                    </div>
                )}
            </Button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Truck className="w-4 h-4 text-primary" />
                    <span>Free shipping over ₹5000</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span>Authenticity Guaranteed</span>
                </div>
            </div>
        </div>
    );
}
