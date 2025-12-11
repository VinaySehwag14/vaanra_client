"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ApiClient } from "@/lib/api-client";
import { ORDER_STATUS_CONFIG } from "@/types/order";

export default function RecentOrder() {
    const { user } = useAuth();
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchRecentOrders = async () => {
            try {
                const response = await ApiClient.getUserOrders(user);
                if (response.success && response.orders) {
                    // Map and take top 2
                    const mapped = response.orders.slice(0, 2).map((order: any) => ({
                        id: order.id,
                        orderNumber: `UF-${String(order.id).padStart(6, '0')}`,
                        status: order.status || "processing",
                        items: order.items?.map((item: any) => ({
                            ...item,
                            image: item.product_image || item.image || "/placeholder-product.jpg"
                        })) || [],
                        total: order.final_amount
                    }));
                    setRecentOrders(mapped);
                }
            } catch (error) {
                console.error("Failed to fetch recent orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentOrders();
    }, [user]);

    if (loading) {
        return (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-8 animate-pulse">
                <div className="h-6 w-32 bg-zinc-100 dark:bg-zinc-800 rounded mb-6" />
                <div className="h-20 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
            </div>
        )
    }

    if (recentOrders.length === 0) {
        return (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-8 text-center">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                    Recent Orders
                </h2>
                <p className="text-zinc-500 mb-4">No orders placed yet.</p>
                <Link href="/products" className="text-primary hover:underline">Start Shopping</Link>
            </div>
        )
    }

    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    Recent Orders
                </h2>
                <Link
                    href="/profile/orders"
                    className="text-sm font-medium text-primary hover:text-primary/80"
                >
                    View All
                </Link>
            </div>

            <div className="space-y-6">
                {recentOrders.map((order) => {
                    const firstItem = order.items[0];
                    const itemCount = order.items.length;
                    const statusConfig = ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG] || ORDER_STATUS_CONFIG["pending"];

                    return (
                        <div key={order.id} className="flex items-center gap-4">
                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                                {firstItem ? (
                                    <Image
                                        src={firstItem.image}
                                        alt={firstItem.product_name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-zinc-400 text-xs">No Items</div>
                                )}

                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-zinc-900 dark:text-zinc-50 truncate">
                                    {firstItem ? firstItem.product_name : "Order #" + order.orderNumber}
                                    {itemCount > 1 && <span className="text-zinc-500 font-normal ml-1">(+{itemCount - 1} more)</span>}
                                </h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Order #{order.orderNumber}
                                </p>
                                <p className={`mt-1 text-sm font-medium ${statusConfig.color}`}>
                                    Status: {statusConfig.label}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
