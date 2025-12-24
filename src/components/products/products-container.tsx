"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "./product-grid";
import ProductSort from "./product-sort";
import LiveActivityFeed from "./live-activity-feed";
import { ApiClient } from "@/lib/api-client";
import { mapApiProductToProduct, Product, ApiProduct } from "@/types/product";

export default function ProductsContainer() {
    const searchParams = useSearchParams();

    // Get all filter params
    const categorySlug = searchParams.get("category");
    const colorsParam = searchParams.get("colors");
    const sizesParam = searchParams.get("sizes");
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || Infinity;
    const sortBy = searchParams.get("sort") || "newest";

    const [products, setProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Parse filter arrays
    const selectedColors = useMemo(
        () => colorsParam?.split(",").filter(Boolean) || [],
        [colorsParam]
    );
    const selectedSizes = useMemo(
        () => sizesParam?.split(",").filter(Boolean) || [],
        [sizesParam]
    );

    // Fetch products when category changes
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                // Pass slug directly to API, skip if "all"
                const categoryParam = categorySlug && categorySlug.toLowerCase() !== "all"
                    ? categorySlug
                    : undefined;

                // Fetch products with optional category filter (using slug)
                const response = await ApiClient.getProducts(
                    categoryParam ? { category: categoryParam } : undefined
                );

                setAllProducts(response.products || []);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Failed to load products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categorySlug]);

    // Filter and sort products client-side
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = [...allProducts];

        // Filter by colors (check if any variant has the selected color)
        if (selectedColors.length > 0) {
            filtered = filtered.filter((product) => {
                if (!product.variants || product.variants.length === 0) return false;
                return product.variants.some((variant) =>
                    selectedColors.some(
                        (color) => variant.color?.toLowerCase() === color.toLowerCase()
                    )
                );
            });
        }

        // Filter by sizes (check if any variant has the selected size)
        if (selectedSizes.length > 0) {
            filtered = filtered.filter((product) => {
                if (!product.variants || product.variants.length === 0) return false;
                return product.variants.some((variant) =>
                    selectedSizes.some(
                        (size) => variant.size?.toUpperCase() === size.toUpperCase()
                    )
                );
            });
        }

        // Filter by price range
        if (minPrice > 0 || maxPrice < Infinity) {
            filtered = filtered.filter((product) => {
                const price = product.selling_price ?? product.sale_price ?? product.price ?? 0;
                return price >= minPrice && price <= maxPrice;
            });
        }

        // Sort products
        switch (sortBy) {
            case "price-low":
                filtered.sort((a, b) => {
                    const priceA = a.selling_price ?? a.sale_price ?? a.price ?? 0;
                    const priceB = b.selling_price ?? b.sale_price ?? b.price ?? 0;
                    return priceA - priceB;
                });
                break;
            case "price-high":
                filtered.sort((a, b) => {
                    const priceA = a.selling_price ?? a.sale_price ?? a.price ?? 0;
                    const priceB = b.selling_price ?? b.sale_price ?? b.price ?? 0;
                    return priceB - priceA;
                });
                break;
            case "name-asc":
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "newest":
            default:
                // Assuming newest is the default order from API, or sort by created_at if available
                filtered.sort((a, b) => {
                    if (a.created_at && b.created_at) {
                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    }
                    return 0;
                });
                break;
        }

        // Map to UI products
        return filtered.map(mapApiProductToProduct);
    }, [allProducts, selectedColors, selectedSizes, minPrice, maxPrice, sortBy]);

    // Update products state when filtered products change
    useEffect(() => {
        setProducts(filteredAndSortedProducts);
    }, [filteredAndSortedProducts]);

    // Count active filters
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (selectedColors.length > 0) count++;
        if (selectedSizes.length > 0) count++;
        if (minPrice > 0 || maxPrice < 10000) count++;
        return count;
    }, [selectedColors, selectedSizes, minPrice, maxPrice]);

    if (loading) {
        return (
            <div className="flex-1">
                <div className="mb-6 flex items-center justify-between">
                    <div className="h-8 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                    <div className="h-10 w-44 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="space-y-4">
                            <div className="aspect-[3/4] animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
                            <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                            <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1">
                <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 p-8 text-center">
                    <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
                    <p className="text-red-500 dark:text-red-500 text-sm mt-2">
                        Please try again later
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex-1">
                {/* Header with count and sort */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                            {products.length} {products.length === 1 ? "Product" : "Products"}
                        </p>
                        {activeFilterCount > 0 && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                {activeFilterCount} {activeFilterCount === 1 ? "filter" : "filters"} applied
                            </span>
                        )}
                    </div>
                    <ProductSort />
                </div>

                {products.length === 0 ? (
                    <div className="rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-8 text-center">
                        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                            No products found
                            {categorySlug && categorySlug !== "all" && ` in "${categorySlug}"`}
                            {activeFilterCount > 0 && " with the selected filters"}
                        </p>
                        <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-2">
                            Try adjusting your filters or browse all products
                        </p>
                    </div>
                ) : (
                    <ProductGrid products={products} />
                )}
            </div>

            {/* Live Activity Feed */}
            <LiveActivityFeed />
        </>
    );
}
