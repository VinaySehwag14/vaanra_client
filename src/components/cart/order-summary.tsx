"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
    subtotal: number;
    shipping: number;
    onCheckout: () => void;
}

export default function OrderSummary({
    subtotal,
    shipping,
    onCheckout,
}: OrderSummaryProps) {
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);

    const total = subtotal + shipping - discount;

    const handleApplyCoupon = () => {
        // Mock coupon validation
        if (couponCode.toLowerCase() === "wave10") {
            setDiscount(subtotal * 0.1);
        } else {
            setDiscount(0);
        }
    };

    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                Order Summary
            </h2>

            <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Subtotal</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        ₹{subtotal.toFixed(2)}
                    </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Shipping</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        ₹{shipping.toFixed(2)}
                    </span>
                </div>

                {/* Discount */}
                {discount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>Discount</span>
                        <span className="font-medium">-₹{discount.toFixed(2)}</span>
                    </div>
                )}

                {/* Divider */}
                <div className="border-t border-zinc-200 dark:border-zinc-800" />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>

                {/* Coupon Code */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Coupon Code
                    </label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            variant="outline"
                            onClick={handleApplyCoupon}
                            className="shrink-0"
                        >
                            Apply
                        </Button>
                    </div>
                    {discount > 0 && (
                        <p className="text-xs text-green-600 dark:text-green-400">
                            Coupon applied successfully!
                        </p>
                    )}
                </div>

                {/* Checkout Button */}
                <Button
                    onClick={onCheckout}
                    className="w-full rounded-full bg-primary py-6 text-base font-bold text-black hover:bg-primary"
                >
                    Proceed to Checkout
                </Button>
            </div>
        </div>
    );
}
