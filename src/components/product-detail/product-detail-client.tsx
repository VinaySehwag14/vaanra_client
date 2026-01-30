"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ApiClient } from "@/lib/api-client";
import { ApiProduct, ProductImage, ProductVariant } from "@/types/product";
import ProductGallery from "@/components/product-detail/product-gallery";
import ProductInfo from "@/components/product-detail/product-info";
import CompleteLook from "@/components/product-detail/complete-look";
import RelatedProducts from "@/components/product-detail/related-products";
import { ChevronRight } from "lucide-react";

// Extended product type with additional detail fields
interface ProductDetailData extends ApiProduct {
    rating?: number;
    reviews_count?: number;
    variants: ProductVariant[];
}

interface ProductDetailClientProps {
    slug: string;
}

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
    const [product, setProduct] = useState<ProductDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProduct() {
            try {
                setLoading(true);
                const data = await ApiClient.getProductBySlug(slug);
                setProduct(data);
            } catch (err) {
                console.error("Failed to fetch product:", err);
                setError("Failed to load product details");
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="container mx-auto px-4 pt-28 md:pt-36 pb-6 md:pb-10">
                    {/* Breadcrumb Skeleton */}
                    <div className="h-4 w-48 animate-pulse rounded bg-gray-100 mb-8" />

                    {/* Main Grid Skeleton */}
                    <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
                        {/* Gallery Skeleton */}
                        <div className="space-y-4">
                            <div className="aspect-square animate-pulse rounded-lg bg-gray-100" />
                            <div className="flex gap-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-20 h-20 animate-pulse rounded-lg bg-gray-100" />
                                ))}
                            </div>
                        </div>

                        {/* Info Skeleton */}
                        <div className="space-y-6">
                            <div className="h-10 w-3/4 animate-pulse rounded bg-gray-100" />
                            <div className="h-8 w-1/4 animate-pulse rounded bg-gray-100" />
                            <div className="h-24 w-full animate-pulse rounded-lg bg-gray-100" />
                            <div className="flex gap-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-10 h-10 animate-pulse rounded-full bg-gray-100" />
                                ))}
                            </div>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-16 h-11 animate-pulse rounded-lg bg-gray-100" />
                                ))}
                            </div>
                            <div className="h-14 w-full animate-pulse rounded-lg bg-gray-100" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="bg-red-50 rounded-2xl p-8 text-center max-w-md mx-4 border border-red-100">
                    <p className="text-red-600 text-lg font-medium">
                        {error || "Product not found"}
                    </p>
                    <Link href="/products" className="text-primary hover:underline text-sm mt-3 inline-block">
                        ← Back to products
                    </Link>
                </div>
            </div>
        );
    }

    // Get all image URLs - handle both new format and legacy format
    const images = (product.images || [])
        .sort((a: ProductImage, b: ProductImage) => {
            if (a.is_primary) return -1;
            if (b.is_primary) return 1;
            return (a.sort_order ?? 0) - (b.sort_order ?? 0);
        })
        .map((img: ProductImage) => img.image_url || img.url || '')
        .filter((url: string) => url !== '');

    // Calculate pricing - support both new and legacy API fields
    const currentPrice = product.selling_price ?? product.sale_price ?? product.price ?? 0;
    const originalMrp = product.mrp ?? product.price;
    const showOriginalPrice = product.is_on_sale && originalMrp && currentPrice < originalMrp;

    // Get category name
    const categoryName = product.categories?.[0]?.name || product.category_name || "Products";

    // Get stock from first variant or product level
    const productStock = product.variants?.[0]?.stock_quantity ?? product.stock ?? 0;

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 pt-28 md:pt-36 pb-6 md:pb-10">
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <Link href="/" className="hover:text-primary transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                    <Link href="/products" className="hover:text-primary transition-colors">
                        Shop
                    </Link>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                    <span className="text-gray-900 font-medium truncate max-w-[200px]">
                        {product.name}
                    </span>
                </nav>

                {/* Main Product Grid - Two Columns */}
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 mb-20">
                    {/* Left: Product Gallery */}
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <ProductGallery images={images} />
                    </div>

                    {/* Right: Product Info */}
                    <div>
                        <ProductInfo
                            title={product.name}
                            price={currentPrice}
                            originalPrice={showOriginalPrice ? originalMrp : undefined}
                            rating={product.rating ?? 4.5}
                            reviews={product.reviews_count ?? 128}
                            description={product.description ?? ""}
                            stock={productStock}
                            variants={product.variants || []}
                        />
                    </div>
                </div>

                {/* Additional Sections */}
                <div className="space-y-20 pb-20">
                    {/* Visual Details Grid */}
                    {images.length > 1 && (
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">Product Gallery</h2>
                                <div className="h-px bg-gray-200 flex-1" />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {images.map((image: string, index: number) => (
                                    <div
                                        key={index}
                                        className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group cursor-pointer"
                                    >
                                        <Image
                                            src={image}
                                            alt={`${product.name} - Image ${index + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Complete the Look */}
                    <CompleteLook />

                    {/* Related Products */}
                    <RelatedProducts
                        categoryName={categoryName}
                        currentProductId={product.id}
                    />
                </div>
            </div>
        </div>
    );
}
