"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, CreditCard, Truck, MapPin, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/hooks/useAuth";
import { ApiClient } from "@/lib/api-client";
import Script from "next/script";
import Image from "next/image";

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
                    router.push(`/thank-you?orderId=${response.order_id}`);
                } else {
                    alert(response.message || "Failed to place order");
                }
            } else {
                // For Online Payment
                const paymentOrderResponse = await ApiClient.createPaymentOrder(user, {
                    amount: total,
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

                const dbOrderId = paymentOrderResponse.db_order_id;

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: paymentOrderResponse.order.amount,
                    currency: paymentOrderResponse.order.currency,
                    name: "Vaanra",
                    description: "Order Payment",
                    image: "/logo/vaanra_white_bg.png",
                    order_id: paymentOrderResponse.order.id,
                    handler: async function (response: any) {
                        try {
                            const verifyRes = await ApiClient.verifyPayment(user, {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                db_order_id: dbOrderId
                            });

                            if (verifyRes.success) {
                                await clearCart();
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
                        color: "#FA9B25",
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
            <div className="min-h-screen bg-neutral-50 dark:bg-zinc-950 flex items-center justify-center">
                <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900 max-w-md shadow-soft">
                    <h2 className="mb-2 text-2xl font-bold text-foreground">
                        No items to checkout
                    </h2>
                    <p className="mb-8 text-muted-foreground">
                        Your cart is empty.
                    </p>
                    <Button asChild className="rounded-full px-8">
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 pb-20 dark:bg-black/20">
            <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 max-w-7xl">
                {/* Back Link */}
                <Link
                    href="/cart"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Cart
                </Link>

                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <h1 className="text-3xl font-black text-foreground md:text-5xl">
                        Checkout
                    </h1>
                    <div className="flex items-center gap-2 text-sm font-medium bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200 dark:bg-green-900/10 dark:text-green-400 dark:border-green-900/20">
                        <ShieldCheck className="h-4 w-4" /> Secure & Encrypted
                    </div>
                </div>

                <div className="grid gap-10 lg:grid-cols-12">
                    {/* Left Column - Form */}
                    <div className="space-y-8 lg:col-span-8">
                        {/* Shipping Address */}
                        <div className="rounded-[2rem] border border-border/50 bg-card p-6 md:p-8 shadow-sm">
                            <div className="mb-8 flex items-center gap-3">
                                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">
                                    Shipping Address
                                </h2>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="John Doe"
                                        className={`rounded-xl h-11 bg-muted/30 ${errors.fullName ? "border-red-500" : ""}`}
                                    />
                                    {errors.fullName && <p className="text-xs text-red-500 font-medium ml-1">{errors.fullName}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="10-digit number"
                                        className={`rounded-xl h-11 bg-muted/30 ${errors.phone ? "border-red-500" : ""}`}
                                    />
                                    {errors.phone && <p className="text-xs text-red-500 font-medium ml-1">{errors.phone}</p>}
                                </div>

                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="john@example.com"
                                        className={`rounded-xl h-11 bg-muted/30 ${errors.email ? "border-red-500" : ""}`}
                                    />
                                    {errors.email && <p className="text-xs text-red-500 font-medium ml-1">{errors.email}</p>}
                                </div>

                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="street">Street Address</Label>
                                    <Input
                                        id="street"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleInputChange}
                                        placeholder="House No., Building, Street"
                                        className={`rounded-xl h-11 bg-muted/30 ${errors.street ? "border-red-500" : ""}`}
                                    />
                                    {errors.street && <p className="text-xs text-red-500 font-medium ml-1">{errors.street}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="City"
                                        className={`rounded-xl h-11 bg-muted/30 ${errors.city ? "border-red-500" : ""}`}
                                    />
                                    {errors.city && <p className="text-xs text-red-500 font-medium ml-1">{errors.city}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        placeholder="State"
                                        className={`rounded-xl h-11 bg-muted/30 ${errors.state ? "border-red-500" : ""}`}
                                    />
                                    {errors.state && <p className="text-xs text-red-500 font-medium ml-1">{errors.state}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="pincode">Pincode</Label>
                                    <Input
                                        id="pincode"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        placeholder="000000"
                                        className={`rounded-xl h-11 bg-muted/30 ${errors.pincode ? "border-red-500" : ""}`}
                                    />
                                    {errors.pincode && <p className="text-xs text-red-500 font-medium ml-1">{errors.pincode}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="landmark">Landmark (Optional)</Label>
                                    <Input
                                        id="landmark"
                                        name="landmark"
                                        value={formData.landmark}
                                        onChange={handleInputChange}
                                        placeholder="Near..."
                                        className="rounded-xl h-11 bg-muted/30"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="rounded-[2rem] border border-border/50 bg-card p-6 md:p-8 shadow-sm">
                            <div className="mb-8 flex items-center gap-3">
                                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <CreditCard className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">
                                    Payment Method
                                </h2>
                            </div>

                            <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "cod" | "online")}>
                                <div className="space-y-4">
                                    <Label
                                        htmlFor="cod"
                                        className={`flex items-center space-x-4 rounded-xl border p-5 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5 ring-1 ring-primary ring-offset-2' : 'border-border hover:border-primary/50'}`}
                                    >
                                        <RadioGroupItem value="cod" id="cod" />
                                        <div className="flex-1">
                                            <div className="font-bold text-base">Cash on Delivery</div>
                                            <div className="text-sm text-muted-foreground mt-0.5">
                                                Pay comfortably when your order arrives
                                            </div>
                                        </div>
                                        <Truck className={`h-6 w-6 ${paymentMethod === 'cod' ? 'text-primary' : 'text-zinc-300'}`} />
                                    </Label>

                                    <Label
                                        htmlFor="online"
                                        className={`flex items-center space-x-4 rounded-xl border p-5 cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-primary bg-primary/5 ring-1 ring-primary ring-offset-2' : 'border-border hover:border-primary/50'}`}
                                    >
                                        <RadioGroupItem value="online" id="online" />
                                        <div className="flex-1">
                                            <div className="font-bold text-base">Pay Online</div>
                                            <div className="text-sm text-muted-foreground mt-0.5">
                                                Cards, UPI, Net Banking via Razorpay
                                            </div>
                                        </div>
                                        <CreditCard className={`h-6 w-6 ${paymentMethod === 'online' ? 'text-primary' : 'text-zinc-300'}`} />
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24">
                            <div className="rounded-[2rem] border border-border/50 bg-card p-6 md:p-8 shadow-soft">
                                <h2 className="mb-6 text-xl font-bold text-foreground">
                                    Your Order
                                </h2>

                                {/* Cart Items */}
                                <div className="mb-6 space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                                    {cartItems.map((item) => (
                                        <div key={item.cart_item_id} className="flex items-center gap-4">
                                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                                                <Image
                                                    src={item.product_image || "/placeholder-product.jpg"}
                                                    alt={item.product_name}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <span className="absolute bottom-0 right-0 h-4 w-4 bg-primary text-[10px] font-bold text-white flex items-center justify-center rounded-tl-md">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="truncate text-sm font-bold text-foreground">
                                                    {item.product_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {item.size} / {item.color}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-foreground">
                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-dashed border-border py-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span className="font-medium text-primary"> {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}</span>
                                    </div>
                                </div>

                                <div className="border-t border-border pt-4">
                                    <div className="flex justify-between items-end mb-6">
                                        <span className="text-lg font-bold">Total Pay</span>
                                        <span className="text-2xl font-black text-primary">₹{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handlePlaceOrder}
                                    disabled={isSubmitting}
                                    className="w-full rounded-full bg-primary h-14 text-base font-bold text-black hover:bg-primary/90 shadow-lg shadow-primary/25"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        `Place Order`
                                    )}
                                </Button>

                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                    <Lock className="h-3 w-3" /> Guaranteed Safe Checkout
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        </div >
    );
}
