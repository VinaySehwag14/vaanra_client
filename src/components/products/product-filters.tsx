"use client";

import { useCallback, useMemo, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const categories = [
    { id: "t-shirts", label: "T-Shirts" },
    { id: "hoodies", label: "Hoodies" },
    { id: "sweatshirts", label: "Sweatshirts" },
    { id: "jackets", label: "Jackets" },
    { id: "bottoms", label: "Bottoms" },
    { id: "accessories", label: "Accessories" },
];

const colors = [
    { id: "black", class: "bg-black", label: "Black" },
    { id: "white", class: "bg-white border border-zinc-200", label: "White" },
    { id: "gray", class: "bg-zinc-500", label: "Gray" },
    { id: "blue", class: "bg-blue-500", label: "Blue" },
    { id: "green", class: "bg-emerald-500", label: "Green" },
    { id: "red", class: "bg-red-500", label: "Red" },
    { id: "yellow", class: "bg-yellow-400", label: "Yellow" },
    { id: "purple", class: "bg-purple-500", label: "Purple" },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductFilters() {
    return (
        <>
            {/* Desktop Filters */}
            <div className="hidden lg:block w-64 space-y-8 sticky top-24 h-fit">
                <div className="rounded-3xl border border-white/20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Filters
                        </h2>
                        <div className="mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-primary to-primary/50" />
                    </div>
                    <FilterContent />
                </div>
            </div>

            {/* Mobile Filters */}
            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="gap-2 rounded-xl border-white/20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all">
                            <Filter className="h-4 w-4" /> Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[350px] border-white/20 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl">
                        <SheetTitle className="text-lg font-bold mb-6">Filters</SheetTitle>
                        <ScrollArea className="h-[calc(100vh-100px)] pr-4">
                            <FilterContent />
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}

function FilterContent() {
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

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            updateFilters({
                minPrice: values[0] > 0 ? String(values[0]) : null,
                maxPrice: values[1] < 10000 ? String(values[1]) : null,
            });
        }, 300);
    };

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const handleCategoryChange = (categoryId: string, checked: boolean) => {
        if (checked) {
            updateFilters({ category: categoryId });
        } else if (currentCategory === categoryId) {
            updateFilters({ category: null });
        }
    };

    const handleColorChange = (colorId: string) => {
        const newColors = currentColors.includes(colorId)
            ? currentColors.filter((c) => c !== colorId)
            : [...currentColors, colorId];

        updateFilters({ colors: newColors.length > 0 ? newColors.join(",") : null });
    };

    const handleSizeChange = (size: string) => {
        const newSizes = currentSizes.includes(size)
            ? currentSizes.filter((s) => s !== size)
            : [...currentSizes, size];

        updateFilters({ sizes: newSizes.length > 0 ? newSizes.join(",") : null });
    };

    const handleClearAll = () => {
        setPriceRange([0, 10000]);
        router.push(pathname, { scroll: false });
    };

    const hasActiveFilters = useMemo(() => {
        return currentCategory || currentColors.length > 0 || currentSizes.length > 0 || minPrice > 0 || maxPrice < 10000;
    }, [currentCategory, currentColors, currentSizes, minPrice, maxPrice]);

    return (
        <div className="space-y-4">
            {hasActiveFilters && (
                <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 p-4 mb-6 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm font-bold text-primary">Active Filters</span>
                    </div>
                    <button
                        onClick={handleClearAll}
                        className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all hover:scale-105"
                    >
                        Clear All <X className="h-3 w-3" />
                    </button>
                </div>
            )}

            {/* Categories */}
            <div className="rounded-2xl bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-800/50 dark:to-zinc-900/50 p-4 border border-zinc-200/50 dark:border-zinc-700/50">
                <button
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="flex w-full items-center justify-between text-sm font-bold text-foreground mb-3 hover:text-primary transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Categories
                    </span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isCategoryOpen && "rotate-180")} />
                </button>
                {isCategoryOpen && (
                    <div className="space-y-2.5 pl-1">
                        {categories.map((category) => (
                            <div key={category.id} className="flex items-center space-x-3 group">
                                <Checkbox
                                    id={category.id}
                                    checked={currentCategory === category.id}
                                    onCheckedChange={(checked) =>
                                        handleCategoryChange(category.id, checked as boolean)
                                    }
                                    className="data-[state=checked]:bg-gradient-primary border-neutral-300 dark:border-neutral-600 rounded-md"
                                />
                                <Label
                                    htmlFor={category.id}
                                    className={cn(
                                        "text-sm font-medium cursor-pointer transition-colors group-hover:text-primary",
                                        currentCategory === category.id ? "text-primary font-semibold" : "text-muted-foreground"
                                    )}
                                >
                                    {category.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Price Range */}
            <div className="rounded-2xl bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-800/50 dark:to-zinc-900/50 p-4 border border-zinc-200/50 dark:border-zinc-700/50">
                <button
                    onClick={() => setIsPriceOpen(!isPriceOpen)}
                    className="flex w-full items-center justify-between text-sm font-bold text-foreground mb-4 hover:text-primary transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Price
                    </span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isPriceOpen && "rotate-180")} />
                </button>
                {isPriceOpen && (
                    <div className="px-1">
                        <Slider
                            defaultValue={[0, 10000]}
                            max={10000}
                            step={100}
                            value={priceRange}
                            onValueChange={handlePriceChange}
                            className="py-4"
                        />
                        <div className="flex items-center justify-between text-sm font-bold mt-2">
                            <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary">₹{priceRange[0]}</span>
                            <span className="text-muted-foreground">—</span>
                            <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary">₹{priceRange[1]}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Colors */}
            <div className="rounded-2xl bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-800/50 dark:to-zinc-900/50 p-4 border border-zinc-200/50 dark:border-zinc-700/50">
                <button
                    onClick={() => setIsColorOpen(!isColorOpen)}
                    className="flex w-full items-center justify-between text-sm font-bold text-foreground mb-4 hover:text-primary transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Color
                    </span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isColorOpen && "rotate-180")} />
                </button>
                {isColorOpen && (
                    <div className="flex flex-wrap gap-3">
                        {colors.map((color) => (
                            <button
                                key={color.id}
                                onClick={() => handleColorChange(color.id)}
                                className={cn(
                                    "h-10 w-10 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-md",
                                    color.class,
                                    currentColors.includes(color.id) && "ring-2 ring-primary ring-offset-2 scale-110 shadow-lg"
                                )}
                                aria-label={`Select ${color.label} color`}
                                title={color.label}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Sizes */}
            <div className="rounded-2xl bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-800/50 dark:to-zinc-900/50 p-4 border border-zinc-200/50 dark:border-zinc-700/50">
                <button
                    onClick={() => setIsSizeOpen(!isSizeOpen)}
                    className="flex w-full items-center justify-between text-sm font-bold text-foreground mb-4 hover:text-primary transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Size
                    </span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isSizeOpen && "rotate-180")} />
                </button>
                {isSizeOpen && (
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => handleSizeChange(size)}
                                className={cn(
                                    "flex h-11 w-14 items-center justify-center rounded-xl border text-sm font-bold transition-all hover:scale-105",
                                    currentSizes.includes(size)
                                        ? "border-primary bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg scale-105"
                                        : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-muted-foreground hover:border-primary/50 hover:text-foreground shadow-sm"
                                )}
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
