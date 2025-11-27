"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import CartItemCard from "@/components/cart/cart-item-card";
import OrderSummary from "@/components/cart/order-summary";
import CompleteYourLook from "@/components/cart/complete-your-look";
import { CartItem } from "@/types/cart";
import { Button } from "@/components/ui/button";

// Mock cart data
const initialCartItems: CartItem[] = [
    {
        id: "1",
        name: "Acid Wash Hoodie",
        size: "Large",
        color: "Ocean Blue",
        price: 65.00,
        quantity: 1,
        image: "/gallery/wear-waves-2.jpg",
    },
    {
        id: "2",
        name: "Gradient Tee",
        size: "Medium",
        color: "Sunset",
        price: 35.00,
        quantity: 1,
        image: "/carousel/summer-edit.jpg",
    },
];

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

    const handleUpdateQuantity = (id: string, quantity: number) => {
        setCartItems((items) =>
            items.map((item) =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const handleRemoveItem = (id: string) => {
        setCartItems((items) => items.filter((item) => item.id !== id));
    };

    const handleCheckout = () => {
        console.log("Proceeding to checkout");
        // Navigate to checkout page
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const shipping = 5.00;

    return (
        <div className="min-h-screen bg-zinc-50 pb-20 dark:bg-zinc-950">
            <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 md:text-4xl">
                        Your Wave Cart
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                        {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
                    </p>
                </div>

                {cartItems.length > 0 ? (
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Cart Items */}
                        <div className="space-y-4 lg:col-span-2">
                            {cartItems.map((item) => (
                                <CartItemCard
                                    key={item.id}
                                    item={item}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:sticky lg:top-24 lg:self-start">
                            <OrderSummary
                                subtotal={subtotal}
                                shipping={shipping}
                                onCheckout={handleCheckout}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                        <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-zinc-400" />
                        <h2 className="mb-2 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                            Your cart is empty
                        </h2>
                        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
                            Add some items to get started!
                        </p>
                        <Button asChild className="rounded-full">
                            <Link href="/products">Continue Shopping</Link>
                        </Button>
                    </div>
                )}

                {/* Complete Your Look */}
                {cartItems.length > 0 && (
                    <div className="mt-12">
                        <CompleteYourLook />
                    </div>
                )}
            </div>
        </div>
    );
}
