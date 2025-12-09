"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "./product-grid";
import { ApiClient } from "@/lib/api-client";
import { mapApiProductToProduct, Product } from "@/types/product";

export default function ProductsContainer() {
    const searchParams = useSearchParams();
    const category = searchParams.get("category");

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch products with optional category filter
                const response = await ApiClient.getProducts(
                    category ? { category } : undefined
                );

                // Map API products to UI products
                const mappedProducts = response.products.map(mapApiProductToProduct);
                setProducts(mappedProducts);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Failed to load products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    if (loading) {
        return (
            <div className="flex-1">
                <div className="mb-6">
                    <div className="h-8 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
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

    if (products.length === 0) {
        return (
            <div className="flex-1">
                <div className="rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-8 text-center">
                    <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                        No products found
                        {category && ` in category "${category}"`}
                    </p>
                </div>
            </div>
        );
    }

    return <ProductGrid products={products} />;
}
