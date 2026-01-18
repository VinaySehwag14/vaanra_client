"use client";

import Image from "next/image";
import { ShoppingBag, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CompleteLook() {
    const bundleItems = [
        {
            id: 1,
            name: "Vaanra Wave Hoodie",
            price: 1299,
            originalPrice: 1999,
            image: "/gallery/vaanra-2.jpg",
            isMain: true
        },
        {
            id: 2,
            name: "Dockside Beanie",
            price: 599,
            originalPrice: 899,
            image: "/gallery/vaanra-1.jpg",
            isMain: false
        },
        {
            id: 3,
            name: "Vaanra Joggers",
            price: 1499,
            originalPrice: 2199,
            image: "/gallery/vaanra-3.jpg",
            isMain: false
        }
    ];

    const totalPrice = bundleItems.reduce((sum, item) => sum + item.price, 0);
    const totalOriginalPrice = bundleItems.reduce((sum, item) => sum + item.originalPrice, 0);
    const savings = totalOriginalPrice - totalPrice;

    return (
        <section className="mb-20">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                        <ShoppingBag className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Bundle & Save</span>
                    </div>
                    <div className="h-px bg-black/10 flex-1" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight mb-2">
                    Complete The Look
                </h2>
                <p className="text-black/60 text-sm md:text-base max-w-2xl">
                    Get the full outfit and save ₹{savings}. Curated pieces that pair perfectly together.
                </p>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="relative">
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                    {bundleItems.map((item, index) => (
                        <div
                            key={item.id}
                            className="group relative shrink-0 w-[280px] snap-start"
                        >
                            {/* Product Card */}
                            <div className="relative h-[380px] rounded-2xl overflow-hidden bg-gray-100 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 opacity-60 group-hover:opacity-90" />

                                {/* Badge */}
                                {item.isMain && (
                                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-primary backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-lg">
                                        Main Item
                                    </div>
                                )}

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-2xl font-black text-white">₹{item.price}</span>
                                        <span className="text-sm text-white/60 line-through">₹{item.originalPrice}</span>
                                    </div>
                                    <div className="w-full py-3 bg-white text-black text-center font-bold text-xs uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100 shadow-lg flex items-center justify-center gap-2">
                                        <Plus className="w-4 h-4" />
                                        Add to Bundle
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Bundle Summary Card */}
                    <div className="group relative shrink-0 w-[280px] snap-start">
                        <div className="h-[380px] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-purple-50 to-primary/5 border-2 border-primary/30 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <ShoppingBag className="w-5 h-5 text-primary" />
                                    <span className="text-sm font-bold text-black/70 uppercase tracking-wider">Bundle Deal</span>
                                </div>
                                <h3 className="text-2xl font-black text-black mb-2">Complete Set</h3>
                                <p className="text-sm text-black/60 mb-6">Get all {bundleItems.length} items together</p>

                                <div className="space-y-3 mb-6">
                                    {bundleItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-2 text-sm">
                                            <Check className="w-4 h-4 text-green-600" />
                                            <span className="text-black/70">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-baseline justify-between mb-4">
                                    <div>
                                        <p className="text-xs font-bold text-black/60 uppercase tracking-wider mb-1">Bundle Price</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-black">₹{totalPrice}</span>
                                            <span className="text-sm text-black/50 line-through">₹{totalOriginalPrice}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-green-600 uppercase">Save</p>
                                        <p className="text-xl font-black text-green-600">₹{savings}</p>
                                    </div>
                                </div>

                                <Button className="w-full h-12 rounded-xl bg-black text-white hover:bg-black/90 font-bold text-sm shadow-lg hover:scale-[1.02] transition-all">
                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                    Add Complete Look to Cart
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="flex justify-center gap-2 mt-6">
                {[...Array(bundleItems.length + 1)].map((_, i) => (
                    <div key={i} className="h-1.5 w-1.5 rounded-full bg-black/20" />
                ))}
            </div>
        </section>
    );
}
