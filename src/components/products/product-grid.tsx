"use client";

import ProductCard from "./product-card";
import { Product } from "@/types/product";

interface ProductGridProps {
    products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
    return (
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
            ))}
        </div>
    );
}

