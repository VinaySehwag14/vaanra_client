"use client";

import Link from "next/link";
import { CheckCircle, Package, Truck, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { use } from "react";

interface OrderConfirmationPageProps {
    params: Promise<{ orderId: string }>;
}

export default function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
    const { orderId } = use(params);

    return (
        <div className="min-h-screen bg-zinc-50 pb-20 dark:bg-zinc-950">
            <div className="container mx-auto px-4 py-16 md:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    {/* Success Icon */}
                    <div className="mb-8 flex justify-center">
                        <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/20">
                            <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50 md:text-4xl">
                        Order Placed Successfully!
                    </h1>
                    <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
                        Thank you for your order. We've received your order and will begin processing it soon.
                    </p>

                    {/* Order ID */}
                    <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Order ID</p>
                        <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                            #{orderId}
                        </p>
                    </div>

                    {/* Timeline */}
                    <div className="mb-12 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                        <h2 className="mb-6 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                            What's Next?
                        </h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <Package className="h-5 w-5 text-primary" />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                                        Order Processing
                                    </p>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                        We're preparing your order for shipment
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                    <Truck className="h-5 w-5 text-zinc-400" />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                                        Shipping
                                    </p>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                        You'll receive tracking details via email
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                    <Home className="h-5 w-5 text-zinc-400" />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                                        Delivery
                                    </p>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                        Expected within 5-7 business days
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Button asChild className="rounded-full bg-primary text-black hover:bg-primary/90">
                            <Link href="/profile/orders">View Order Details</Link>
                        </Button>
                        <Button asChild variant="outline" className="rounded-full">
                            <Link href="/products">Continue Shopping</Link>
                        </Button>
                    </div>

                    {/* Help Text */}
                    <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-400">
                        Questions about your order?{" "}
                        <Link href="/faq" className="text-primary hover:underline">
                            Check our FAQ
                        </Link>{" "}
                        or{" "}
                        <a href="mailto:support@urbanfox.com" className="text-primary hover:underline">
                            contact support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
