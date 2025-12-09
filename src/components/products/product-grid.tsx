"use client";

import ProductCard from "./product-card";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
    products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
    return (
        <div className="flex-1">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    All Products
                </h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        Sort by:
                    </span>
                    <select className="rounded-md border-none bg-transparent text-sm font-bold text-zinc-900 focus:ring-0 dark:text-zinc-50">
                        <option>Newest</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Best Selling</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center">
                <Button variant="outline" className="rounded-full px-8 py-6">
                    Load More
                </Button>
            </div>
        </div>
    );
}
