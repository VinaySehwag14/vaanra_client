"use client";

import { useState } from "react";
import ProfileSidebar from "@/components/profile/profile-sidebar";
import SavedItemCard from "@/components/saved/saved-item-card";
import { SavedItem } from "@/types/saved-item";

// Mock data
const initialSavedItems: SavedItem[] = [
    {
        id: "1",
        name: "Cosmic Wave Hoodie",
        category: "Hoodie",
        price: 89.00,
        image: "/gallery/vaanra-2.jpg",
        inStock: true,
    },
    {
        id: "2",
        name: "Retro Neon T-Shirt",
        category: "T-Shirt",
        price: 35.00,
        image: "/carousel/summer-edit.jpg",
        inStock: true,
    },
    {
        id: "3",
        name: "Pastel Dreams Sweatshirt",
        category: "Sweatshirt",
        price: 75.00,
        image: "/looks/coastal-vibe.jpg",
        inStock: true,
    },
    {
        id: "4",
        name: "Cyberpunk Glitch Tee",
        category: "T-Shirt",
        price: 35.00,
        image: "/carousel/winter-collection.jpg",
        inStock: true,
    },
    {
        id: "5",
        name: "Vaanra Explorer Jacket",
        category: "Jacket",
        price: 120.00,
        image: "/looks/vaanra-explorer.jpg",
        inStock: false,
    },
    {
        id: "6",
        name: "Minimal Crewneck",
        category: "Sweatshirt",
        price: 65.00,
        image: "/gallery/vaanra-1.jpg",
        inStock: true,
    },
];

export default function SavedItemsPage() {
    const [savedItems, setSavedItems] = useState<SavedItem[]>(initialSavedItems);

    const handleRemoveItem = (id: string) => {
        setSavedItems((items) => items.filter((item) => item.id !== id));
    };

    const handleAddToCart = (id: string) => {
        // In a real app, this would add the item to cart
        console.log("Adding item to cart:", id);
        // You could show a toast notification here
    };

    return (
        <div className="min-h-screen bg-zinc-50 pb-20 dark:bg-zinc-950">
            <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Sidebar */}
                    <ProfileSidebar />

                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        {/* Header */}
                        <div>
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                                Saved Items
                            </h1>
                            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                                {savedItems.length} {savedItems.length === 1 ? "item" : "items"} in your wishlist
                            </p>
                        </div>

                        {/* Items Grid */}
                        {savedItems.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {savedItems.map((item) => (
                                    <SavedItemCard
                                        key={item.id}
                                        item={item}
                                        onRemove={handleRemoveItem}
                                        onAddToCart={handleAddToCart}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                                <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                                    No saved items yet
                                </p>
                                <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                                    Start adding items to your wishlist to see them here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
