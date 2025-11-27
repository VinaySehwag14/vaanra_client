"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecommendedProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
}

const recommendedProducts: RecommendedProduct[] = [
    {
        id: "1",
        name: "Wave Cap",
        description: "Black",
        price: 25.00,
        image: "/gallery/wear-waves-1.jpg",
    },
    {
        id: "2",
        name: "Utility Tote Bag",
        description: "Canvas White",
        price: 40.00,
        image: "/looks/coastal-vibe.jpg",
    },
    {
        id: "3",
        name: "Minimalist Socks",
        description: "3-Pack",
        price: 20.00,
        image: "/carousel/summer-edit.jpg",
    },
    {
        id: "4",
        name: "Neon Beanie",
        description: "Pastel Yellow",
        price: 22.00,
        image: "/carousel/winter-collection.jpg",
    },
];

export default function CompleteYourLook() {
    return (
        <div className="rounded-3xl bg-gradient-to-br from-zinc-100 to-zinc-50 p-8 dark:from-zinc-900 dark:to-zinc-950 md:p-12">
            <h2 className="mb-8 text-center text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                Complete Your Look
            </h2>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                {recommendedProducts.map((product) => (
                    <div
                        key={product.id}
                        className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-900"
                    >
                        {/* Product Image */}
                        <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                            <h3 className="font-bold text-zinc-900 line-clamp-1 dark:text-zinc-50">
                                {product.name}
                            </h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {product.description}
                            </p>
                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                    ${product.price.toFixed(2)}
                                </span>
                                <Button
                                    size="icon"
                                    className="h-9 w-9 rounded-full bg-cyan-400 text-black hover:bg-cyan-500"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
