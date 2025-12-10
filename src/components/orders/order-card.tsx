"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Order, ORDER_STATUS_CONFIG } from "@/types/order";
import { cn } from "@/lib/utils";

interface OrderCardProps {
    order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
    const statusConfig = ORDER_STATUS_CONFIG[order.status];

    return (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: Order Info */}
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                        <Package className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-50">
                            Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {order.date}
                        </p>
                    </div>
                </div>

                {/* Middle: Status */}
                <div className="flex items-center gap-4">
                    <div
                        className={cn(
                            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
                            statusConfig.bgColor
                        )}
                    >
                        <div
                            className={cn("h-2 w-2 rounded-full", statusConfig.color.replace("text-", "bg-"))}
                        />
                        <span className={statusConfig.color}>{statusConfig.label}</span>
                    </div>

                    <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                        ₹{order.total.toFixed(2)}
                    </span>
                </div>

                {/* Right: Actions */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        asChild
                    >
                        <Link href={`/profile/orders/${order.id}`}>Reorder</Link>
                    </Button>
                    <Button
                        size="sm"
                        className="rounded-full bg-blue-600 hover:bg-blue-700"
                        asChild
                    >
                        <Link href={`/profile/orders/${order.id}`}>View Details</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
