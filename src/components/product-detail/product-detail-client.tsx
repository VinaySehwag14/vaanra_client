"use client";

import { useEffect, useState } from "react";
import { ApiClient } from "@/lib/api-client";
import { ApiProduct } from "@/types/product";
import ProductGallery from "@/components/product-detail/product-gallery";
import ProductInfo from "@/components/product-detail/product-info";
import CompleteLook from "@/components/product-detail/complete-look";
import RelatedProducts from "@/components/product-detail/related-products";

interface ProductDetailClientProps {
    slug: string;
}

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
    const [product, setProduct] = useState<ApiProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await ApiClient.getProductBySlug(slug);
                setProduct(data.product);
            } catch (err) {
                console.error("Failed to fetch product:", err);
                setError("Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50 pb-20 dark:bg-zinc-950">
                <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
                    <div className="mb-6 h-4 w-64 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                    <div className="mb-16 grid gap-8 lg:grid-cols-2 lg:gap-12">
                        <div className="aspect-square animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
                        <div className="space-y-4">
                            <div className="h-8 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                            <div className="h-6 w-1/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                            <div className="h-20 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-zinc-50 pb-20 dark:bg-zinc-950">
                <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
                    <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 p-8 text-center">
                        <p className="text-red-600 dark:text-red-400 text-lg">
                            {error || "Product not found"}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Get all image URLs - handle both new format (image_url, is_primary) and legacy format (url, sort_order)
    const images = product.images
        .sort((a, b) => {
            // Use is_primary first, then sort_order
            if (a.is_primary) return -1;
            if (b.is_primary) return 1;
            return (a.sort_order ?? 0) - (b.sort_order ?? 0);
        })
        .map(img => img.image_url || img.url || '')
        .filter(url => url !== '');

    // Calculate current price and original price for display
    const currentPrice = product.selling_price ?? product.sale_price ?? product.price ?? 0;
    const originalMrp = product.mrp ?? product.price;
    const showOriginalPrice = product.is_on_sale && originalMrp && currentPrice < originalMrp;

    // Get category name from categories array or legacy field
    const categoryName = product.categories?.[0]?.name || product.category_name || "Products";

    return (
        <div className="min-h-screen bg-zinc-50 pb-20 dark:bg-zinc-950">
            <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
                    <span>Home</span>
                    <span className="mx-2">/</span>
                    <span>{categoryName}</span>
                    <span className="mx-2">/</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        {product.name}
                    </span>
                </div>

                {/* Product Section */}
                <div className="mb-16 grid gap-8 lg:grid-cols-2 lg:gap-12">
                    <ProductGallery images={images} />
                    <ProductInfo
                        title={product.name}
                        price={currentPrice}
                        originalPrice={showOriginalPrice ? originalMrp : undefined}
                        rating={4.5}
                        reviews={128}
                        description={product.description || ''}
                        stock={product.stock}
                        variants={product.variants}
                    />
                </div>

                {/* Complete The Look */}
                <div className="mb-16">
                    <CompleteLook />
                </div>

                {/* Related Products */}
                <RelatedProducts
                    categoryName={categoryName}
                    currentProductId={product.id}
                />
            </div>
        </div>
    );
}
