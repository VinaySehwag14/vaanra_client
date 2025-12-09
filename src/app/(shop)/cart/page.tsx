"use client";

import Link from "next/link";
import { ShoppingBag, Loader2 } from "lucide-react";
import CartItemCard from "@/components/cart/cart-item-card";
import OrderSummary from "@/components/cart/order-summary";
import CompleteYourLook from "@/components/cart/complete-your-look";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const router = useRouter();
    const { cartItems, cartSummary, isLoading, updateQuantity, removeItem } = useCart();

    const handleUpdateQuantity = async (cartItemId: string, quantity: number) => {
        await updateQuantity(Number(cartItemId), quantity);
    };

    const handleRemoveItem = async (cartItemId: string) => {
        await removeItem(Number(cartItemId));
    };

    const handleCheckout = () => {
        router.push("/checkout");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
                <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2 text-zinc-600 dark:text-zinc-400">Loading cart...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Map API cart items to UI format
    const uiCartItems = cartItems.map((item) => ({
        id: String(item.cart_item_id),
        name: item.product_name,
        size: item.size,
        color: item.color,
        price: item.price,
        quantity: item.quantity,
        image: item.product_image || "/placeholder-product.jpg",
    }));

    // Use totals from API summary
    const subtotal = cartSummary?.subtotal || uiCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 999 ? 0 : 99;

    return (
        <div className="min-h-screen bg-zinc-50 pb-20 dark:bg-zinc-950">
            <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 md:text-4xl">
                        Your Wave Cart
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                        {uiCartItems.length} {uiCartItems.length === 1 ? "item" : "items"} in your cart
                    </p>
                </div>

                {uiCartItems.length > 0 ? (
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Cart Items */}
                        <div className="space-y-4 lg:col-span-2">
                            {uiCartItems.map((item) => (
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
                {uiCartItems.length > 0 && (
                    <div className="mt-12">
                        <CompleteYourLook />
                    </div>
                )}
            </div>
        </div>
    );
}
