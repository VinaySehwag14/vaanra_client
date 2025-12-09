"use client";

import { useCallback, useMemo, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const categories = [
    { id: "t-shirts", label: "T-Shirts" },
    { id: "hoodies", label: "Hoodies" },
    { id: "sweatshirts", label: "Sweatshirts" },
    { id: "jackets", label: "Jackets" },
    { id: "bottoms", label: "Bottoms" },
];

const colors = [
    { id: "black", class: "bg-black", label: "Black" },
    { id: "white", class: "bg-white border border-zinc-200", label: "White" },
    { id: "gray", class: "bg-zinc-500", label: "Gray" },
    { id: "blue", class: "bg-blue-500", label: "Blue" },
    { id: "green", class: "bg-green-500", label: "Green" },
    { id: "red", class: "bg-red-500", label: "Red" },
    { id: "yellow", class: "bg-yellow-400", label: "Yellow" },
    { id: "purple", class: "bg-purple-500", label: "Purple" },
];

const sizes = ["S", "M", "L", "XL", "XXL"];

export default function ProductFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // UI state for collapsible sections
    const [isCategoryOpen, setIsCategoryOpen] = useState(true);
    const [isPriceOpen, setIsPriceOpen] = useState(true);
    const [isColorOpen, setIsColorOpen] = useState(true);
    const [isSizeOpen, setIsSizeOpen] = useState(true);

    // Get current filter values from URL
    const currentCategory = searchParams.get("category") || "";
    const currentColors = searchParams.get("colors")?.split(",").filter(Boolean) || [];
    const currentSizes = searchParams.get("sizes")?.split(",").filter(Boolean) || [];
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 10000;

    // Local state for price range
    const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

    // Debounce timer ref
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Sync price range with URL params when they change externally
    useEffect(() => {
        setPriceRange([minPrice, maxPrice]);
    }, [minPrice, maxPrice]);

    // Create query string helper
    const createQueryString = useCallback(
        (updates: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString());

            Object.entries(updates).forEach(([key, value]) => {
                if (value === null || value === "") {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
            });

            return params.toString();
        },
        [searchParams]
    );

    // Update URL with new filters
    const updateFilters = useCallback(
        (updates: Record<string, string | null>) => {
            const queryString = createQueryString(updates);
            router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, { scroll: false });
        },
        [createQueryString, pathname, router]
    );

    // Handle price range change with debounce
    const handlePriceChange = (values: number[]) => {
        setPriceRange(values);

        // Clear existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set new debounced update
        debounceTimerRef.current = setTimeout(() => {
            updateFilters({
                minPrice: values[0] > 0 ? String(values[0]) : null,
                maxPrice: values[1] < 10000 ? String(values[1]) : null,
            });
        }, 300); // 300ms debounce for responsive feel
    };

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    // Handle category selection
    const handleCategoryChange = (categoryId: string, checked: boolean) => {
        if (checked) {
            updateFilters({ category: categoryId });
        } else if (currentCategory === categoryId) {
            updateFilters({ category: null });
        }
    };

    // Handle color selection (multiple)
    const handleColorChange = (colorId: string) => {
        const newColors = currentColors.includes(colorId)
            ? currentColors.filter((c) => c !== colorId)
            : [...currentColors, colorId];

        updateFilters({ colors: newColors.length > 0 ? newColors.join(",") : null });
    };

    // Handle size selection (multiple)
    const handleSizeChange = (size: string) => {
        const newSizes = currentSizes.includes(size)
            ? currentSizes.filter((s) => s !== size)
            : [...currentSizes, size];

        updateFilters({ sizes: newSizes.length > 0 ? newSizes.join(",") : null });
    };

    // Clear all filters
    const handleClearAll = () => {
        setPriceRange([0, 10000]);
        router.push(pathname, { scroll: false });
    };

    // Check if any filters are active
    const hasActiveFilters = useMemo(() => {
        return currentCategory || currentColors.length > 0 || currentSizes.length > 0 || minPrice > 0 || maxPrice < 10000;
    }, [currentCategory, currentColors, currentSizes, minPrice, maxPrice]);

    return (
        <div className="w-full space-y-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    Filters
                </h3>
                {hasActiveFilters && (
                    <button
                        onClick={handleClearAll}
                        className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

            {/* Categories */}
            <div className="space-y-4">
                <button
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="flex w-full items-center justify-between text-sm font-bold text-zinc-900 dark:text-zinc-50"
                >
                    <span>Categories</span>
                    {isCategoryOpen ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </button>
                {isCategoryOpen && (
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <div key={category.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={category.id}
                                    checked={currentCategory === category.id}
                                    onCheckedChange={(checked) =>
                                        handleCategoryChange(category.id, checked as boolean)
                                    }
                                />
                                <Label
                                    htmlFor={category.id}
                                    className="text-sm font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer"
                                >
                                    {category.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

            {/* Price Range */}
            <div className="space-y-4">
                <button
                    onClick={() => setIsPriceOpen(!isPriceOpen)}
                    className="flex w-full items-center justify-between text-sm font-bold text-zinc-900 dark:text-zinc-50"
                >
                    <span>Price Range</span>
                    {isPriceOpen ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </button>
                {isPriceOpen && (
                    <>
                        <Slider
                            defaultValue={[0, 10000]}
                            max={10000}
                            step={100}
                            value={priceRange}
                            onValueChange={handlePriceChange}
                            className="py-4"
                        />
                        <div className="flex items-center justify-between text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            <span>₹{priceRange[0]}</span>
                            <span>₹{priceRange[1]}</span>
                        </div>
                    </>
                )}
            </div>

            <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

            {/* Colors */}
            <div className="space-y-4">
                <button
                    onClick={() => setIsColorOpen(!isColorOpen)}
                    className="flex w-full items-center justify-between text-sm font-bold text-zinc-900 dark:text-zinc-50"
                >
                    <span>Color</span>
                    {isColorOpen ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </button>
                {isColorOpen && (
                    <div className="flex flex-wrap gap-3">
                        {colors.map((color) => (
                            <button
                                key={color.id}
                                onClick={() => handleColorChange(color.id)}
                                className={`h-8 w-8 rounded-full ${color.class} ring-2 ring-offset-2 transition-all hover:scale-110 dark:ring-offset-zinc-900 ${currentColors.includes(color.id)
                                        ? "ring-primary"
                                        : "ring-transparent hover:ring-zinc-300 dark:hover:ring-zinc-600"
                                    }`}
                                aria-label={`Select ${color.label} color`}
                                title={color.label}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

            {/* Sizes */}
            <div className="space-y-4">
                <button
                    onClick={() => setIsSizeOpen(!isSizeOpen)}
                    className="flex w-full items-center justify-between text-sm font-bold text-zinc-900 dark:text-zinc-50"
                >
                    <span>Size</span>
                    {isSizeOpen ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </button>
                {isSizeOpen && (
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => handleSizeChange(size)}
                                className={`flex h-10 w-14 items-center justify-center rounded-md border text-sm font-medium transition-all ${currentSizes.includes(size)
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:border-zinc-50 dark:hover:bg-zinc-700"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
