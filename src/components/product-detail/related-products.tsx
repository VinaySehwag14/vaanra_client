"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/products/product-card";
import { ApiClient } from "@/lib/api-client";
import { mapApiProductToProduct, Product, ApiProduct } from "@/types/product";

interface RelatedProductsProps {
    categoryName?: string;
    currentProductId?: string | number;
}

export default function RelatedProducts({ categoryName, currentProductId }: RelatedProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch products from the same category
                const response = await ApiClient.getProducts(
                    categoryName ? { category: categoryName, limit: 8 } : { limit: 8 }
                );

                // Filter out the current product, then map to UI format
                const mappedProducts = response.products
                    .filter((apiProduct: ApiProduct) => String(apiProduct.id) !== String(currentProductId))
                    .slice(0, 4) // Limit to 4 products
                    .map(mapApiProductToProduct);

                setProducts(mappedProducts);
            } catch (err) {
                console.error("Failed to fetch related products:", err);
                setError("Failed to load related products");
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedProducts();
    }, [categoryName, currentProductId]);

    if (loading) {
        return (
            <div className="space-y-8">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 md:text-3xl">
                    You Might Also Like
                </h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                    {[1, 2, 3, 4].map((i) => (
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

    if (error || products.length === 0) {
        return null; // Don't show the section if there's an error or no products
    }

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 md:text-3xl">
                You Might Also Like
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
