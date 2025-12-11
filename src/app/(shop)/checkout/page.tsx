"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, CreditCard, Truck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/hooks/useAuth";
import { ApiClient } from "@/lib/api-client";
import Script from "next/script";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { cartItems, cartSummary, clearCart } = useCart();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

    // Form state
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Calculate totals - use API summary if available
    const subtotal = cartSummary?.subtotal || cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal + shipping;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Enter valid 10-digit phone";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter valid email";
        if (!formData.street.trim()) newErrors.street = "Street address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State is required";
        if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
        else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Enter valid 6-digit pincode";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePlaceOrder = async () => {
        if (!user) {
            router.push("/login");
            return;
        }

        if (!validateForm()) {
            return;
        }

        if (cartItems.length === 0) {
            alert("Your cart is empty");
            return;
        }

        setIsSubmitting(true);

        try {
            // Validate online payment specific requirements
            if (paymentMethod === "online" && !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
                alert("Online payment is currently unavailable (Configuration Error)");
                return;
            }

            // Prepare order data
            const orderData = {
                shipping_address: {
                    full_name: formData.fullName,
                    phone: formData.phone,
                    email: formData.email,
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                    landmark: formData.landmark || undefined,
                },
                payment_method: paymentMethod,
                items: cartItems.map((item) => ({
                    variant_id: item.variant_id,
                    quantity: item.quantity,
                })),
            };

            // If COD, use regular createOrder
            if (paymentMethod === "cod") {
                const response = await ApiClient.createOrder(user, orderData);

                if (response.success) {
                    await clearCart();
                    // Fix: Redirect to thank you page with order ID (handle both structures if needed)
                    // Assuming response.order_id is correct for COD based on ApiClient
                    router.push(`/thank-you?orderId=${response.order_id}`);
                } else {
                    alert(response.message || "Failed to place order");
                }
            } else {
                // For Online Payment
                // 1. Create Payment Order
                const paymentOrderResponse = await ApiClient.createPaymentOrder(user, {
                    amount: total, // Passing total amount
                    currency: "INR",
                    items: cartItems.map((item) => ({
                        variant_id: item.variant_id,
                        quantity: item.quantity,
                    })),
                    shipping_address: {
                        full_name: formData.fullName,
                        phone: formData.phone,
                        email: formData.email,
                        street: formData.street,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode,
                        landmark: formData.landmark || undefined,
                    }
                });

                if (!paymentOrderResponse.success || !paymentOrderResponse.order) {
                    throw new Error(paymentOrderResponse.message || "Failed to initiate payment");
                }

                const dbOrderId = paymentOrderResponse.db_order_id; // Capture db_order_id from response
                if (!dbOrderId) {
                    console.warn("db_order_id missing in createPaymentOrder response");
                }

                // 2. Open Razorpay Modal
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: paymentOrderResponse.order.amount,
                    currency: paymentOrderResponse.order.currency,
                    name: "Urban Fox",
                    description: "Order Payment",
                    image: "/android-chrome-192x192.png", // Optional logo
                    order_id: paymentOrderResponse.order.id,
                    handler: async function (response: any) {
                        try {
                            // 3. Verify Payment
                            const verifyRes = await ApiClient.verifyPayment(user, {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                db_order_id: dbOrderId
                            });

                            if (verifyRes.success) {
                                await clearCart();
                                // Fix: Check where order_id is located. Sometimes it's inside an 'order' object or at the root.
                                router.push(`/thank-you?orderId=${dbOrderId}`);
                            } else {
                                alert("Payment verification failed. Please contact support.");
                            }
                        } catch (err) {
                            console.error("Payment verification error:", err);
                            alert("Payment succeeded but verification failed. Please contact support.");
                        }
                    },
                    prefill: {
                        name: formData.fullName,
                        email: formData.email,
                        contact: formData.phone,
                    },
                    theme: {
                        color: "#000000", // Matches website theme
                    },
                    modal: {
                        ondismiss: function () {
                            setIsSubmitting(false);
                        }
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.on("payment.failed", function (response: any) {
                    alert(response.error.description);
                    setIsSubmitting(false);
                });

                rzp1.open();
                // Don't set submitting to false here, wait for modal dismiss or success
                return;
            }

        } catch (error: any) {
            console.error("Order placement failed:", error);
            alert(error.message || "Failed to place order. Please try again.");
            setIsSubmitting(false);
        } finally {
            if (paymentMethod === "cod") {
                setIsSubmitting(false);
            }
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
                <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                        <h2 className="mb-2 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                            Your cart is empty
                        </h2>
                        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
                            Add some items before checkout
                        </p>
                        <Button asChild className="rounded-full">
                            <Link href="/products">Continue Shopping</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 pb-20 dark:bg-zinc-950">
            <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
                {/* Back Link */}
                <Link
                    href="/cart"
                    className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Cart
                </Link>

                {/* Header */}
                <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50 md:text-4xl">
                    Checkout
                </h1>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left Column - Form */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* Shipping Address */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="mb-6 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                    Shipping Address
                                </h2>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name *</Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        className={errors.fullName ? "border-red-500" : ""}
                                    />
                                    {errors.fullName && (
                                        <p className="text-xs text-red-500">{errors.fullName}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="10-digit phone number"
                                        className={errors.phone ? "border-red-500" : ""}
                                    />
                                    {errors.phone && (
                                        <p className="text-xs text-red-500">{errors.phone}</p>
                                    )}
                                </div>

                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="your.email@example.com"
                                        className={errors.email ? "border-red-500" : ""}
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-red-500">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="street">Street Address *</Label>
                                    <Input
                                        id="street"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleInputChange}
                                        placeholder="House/Flat No., Street, Area"
                                        className={errors.street ? "border-red-500" : ""}
                                    />
                                    {errors.street && (
                                        <p className="text-xs text-red-500">{errors.street}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="city">City *</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Enter city"
                                        className={errors.city ? "border-red-500" : ""}
                                    />
                                    {errors.city && (
                                        <p className="text-xs text-red-500">{errors.city}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state">State *</Label>
                                    <Input
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        placeholder="Enter state"
                                        className={errors.state ? "border-red-500" : ""}
                                    />
                                    {errors.state && (
                                        <p className="text-xs text-red-500">{errors.state}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="pincode">Pincode *</Label>
                                    <Input
                                        id="pincode"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        placeholder="6-digit pincode"
                                        className={errors.pincode ? "border-red-500" : ""}
                                    />
                                    {errors.pincode && (
                                        <p className="text-xs text-red-500">{errors.pincode}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="landmark">Landmark (Optional)</Label>
                                    <Input
                                        id="landmark"
                                        name="landmark"
                                        value={formData.landmark}
                                        onChange={handleInputChange}
                                        placeholder="Near..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="mb-6 flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-primary" />
                                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                    Payment Method
                                </h2>
                            </div>

                            <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "cod" | "online")}>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
                                        <RadioGroupItem value="cod" id="cod" />
                                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                                            <div className="font-medium">Cash on Delivery</div>
                                            <div className="text-sm text-zinc-500">
                                                Pay when your order arrives
                                            </div>
                                        </Label>
                                        <Truck className="h-5 w-5 text-zinc-400" />
                                    </div>

                                    <div className="flex items-center space-x-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
                                        <RadioGroupItem value="online" id="online" />
                                        <Label htmlFor="online" className="flex-1 cursor-pointer">
                                            <div className="font-medium">Online Payment</div>
                                            <div className="text-sm text-zinc-500">
                                                UPI, Cards, Net Banking
                                            </div>
                                        </Label>
                                        <CreditCard className="h-5 w-5 text-zinc-400" />
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                            <h2 className="mb-6 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                Order Summary
                            </h2>

                            {/* Cart Items */}
                            <div className="mb-4 space-y-3">
                                {cartItems.map((item) => (
                                    <div key={item.cart_item_id} className="flex items-center gap-3">
                                        <img
                                            src={item.product_image || "/placeholder-product.jpg"}
                                            alt={item.product_name}
                                            className="h-12 w-12 rounded-lg object-cover bg-zinc-100 dark:bg-zinc-800"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                                {item.product_name}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                {item.size} | {item.color}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-zinc-200 pt-4 dark:border-zinc-700">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-600 dark:text-zinc-400">Subtotal</span>
                                        <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-600 dark:text-zinc-400">Shipping</span>
                                        <span className="font-medium">
                                            {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handlePlaceOrder}
                                disabled={isSubmitting}
                                className="mt-6 w-full rounded-full bg-primary py-6 text-base font-bold text-black hover:bg-primary/90"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Placing Order...
                                    </>
                                ) : (
                                    `Place Order • ₹${total.toFixed(2)}`
                                )}
                            </Button>

                            {shipping > 0 && (
                                <p className="mt-3 text-center text-xs text-zinc-500">
                                    Free shipping on orders above ₹999
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        </div >
    );
}
