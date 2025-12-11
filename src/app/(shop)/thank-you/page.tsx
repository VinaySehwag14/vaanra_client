"use client";

import Link from "next/link";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ApiClient } from "@/lib/api-client";

function ThankYouContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    // State for order details
    const { user } = useAuth();
    const [order, setOrder] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId || !user) return;

        const fetchOrder = async () => {
            try {
                const response = await ApiClient.getOrderById(user, orderId);
                if (response.success) {
                    setOrder(response.order);
                }
            } catch (err) {
                console.error("Failed to load order:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, user]);

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-900 border-t-transparent dark:border-zinc-50" />
            </div>
        );
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
            <div className="w-full max-w-2xl space-y-8">
                {/* Success Message */}
                <div className="text-center space-y-4">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Thank you for your purchase. Your order #{orderId} has been confirmed.
                    </p>
                </div>

                {order && (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        {/* Order Items */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 border-b pb-2 dark:border-zinc-800">
                                Order Summary
                            </h2>
                            <div className="space-y-4">
                                {order.items?.map((item: any, index: number) => (
                                    <div key={index} className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <p className="font-medium text-zinc-900 dark:text-zinc-50">{item.product_name}</p>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                                Size: {item.variant_details?.size} | Color: {item.variant_details?.color}
                                            </p>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium text-zinc-900 dark:text-zinc-50">
                                            ₹{item.price * item.quantity}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping & Payment */}
                        <div className="mt-6 grid gap-6 md:grid-cols-2 pt-6 border-t dark:border-zinc-800">
                            <div>
                                <h3 className="mb-2 font-medium text-zinc-900 dark:text-zinc-50">Shipping Address</h3>
                                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                    <p>{order.shipping_address?.full_name}</p>
                                    <p>{order.shipping_address?.street}</p>
                                    <p>{order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}</p>
                                    <p>Phone: {order.shipping_address?.phone}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="mb-2 font-medium text-zinc-900 dark:text-zinc-50">Payment Details</h3>
                                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                    <p>Method: <span className="uppercase">{order.payment_method}</span></p>
                                    <p>Status: <span className={`uppercase font-medium ${order.payment_status === 'success' ? 'text-green-600' : 'text-zinc-600'}`}>{order.payment_status || 'Pending'}</span></p>
                                    <div className="mt-2 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                        Total: ₹{order.total_amount}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <Button asChild variant="outline" className="w-full rounded-full h-12">
                        <Link href="/profile/orders">
                            View My Orders
                        </Link>
                    </Button>
                    <Button asChild className="w-full rounded-full h-12" size="lg">
                        <Link href="/products">
                            Continue Shopping <ShoppingBag className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function ThankYouPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ThankYouContent />
        </Suspense>
    );
}
