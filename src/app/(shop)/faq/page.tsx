"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = ["All", "Orders", "Shipping", "Returns", "Payment"];

const faqs = [
    {
        id: 1,
        category: "Orders",
        question: "How do I track my order?",
        answer:
            "After placing an order, you'll receive a confirmation email with your order number and tracking information. You can also track your order by logging into your account and visiting the 'Order History' section. Once your order ships, you'll receive another email with the tracking number and carrier information.",
    },
    {
        id: 2,
        category: "Orders",
        question: "What is your return policy?",
        answer:
            "We offer a 30-day return policy for all unworn, unwashed items with original tags attached. To initiate a return, visit your order history and select the items you'd like to return. We'll provide you with a prepaid return label. Refunds are processed within 5-7 business days after we receive your return.",
    },
    {
        id: 3,
        category: "Shipping",
        question: "What are the shipping options?",
        answer:
            "We offer several shipping options: Standard Shipping (5-7 business days) for ₹99, Express Shipping (2-3 business days) for ₹199, and Next Day Delivery for ₹399. Free standard shipping is available on orders over ₹999. International shipping is available to select countries.",
    },
    {
        id: 4,
        category: "Returns",
        question: "How do I return my order?",
        answer:
            "To return an order, log into your account, go to Order History, select the order you want to return, and click 'Return Items'. Choose the items and reason for return, then print the prepaid return label. Pack the items securely with original tags and ship them back. You'll receive a refund once we process your return.",
    },
    {
        id: 5,
        category: "Payment",
        question: "Do you accept international orders?",
        answer:
            "Yes! We ship to over 50 countries worldwide. International shipping costs vary by destination and are calculated at checkout. Please note that customs fees and import duties may apply and are the responsibility of the customer. Delivery times for international orders typically range from 7-21 business days.",
    },
];

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [openQuestion, setOpenQuestion] = useState<number | null>(null);

    const filteredFaqs = faqs.filter((faq) => {
        const matchesSearch =
            searchQuery === "" ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            activeCategory === "All" || faq.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-zinc-50 pb-20 dark:bg-zinc-950">
            <div className="container mx-auto px-4 py-16 md:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-zinc-50 md:text-5xl">
                        How can we help?
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                        Find answers to common questions about orders, shipping, returns, and more.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mx-auto mb-8 max-w-2xl">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                        <Input
                            type="text"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-14 rounded-full bg-white pl-12 text-base shadow-sm dark:bg-zinc-900"
                        />
                    </div>
                </div>

                {/* Category Filters */}
                <div className="mb-12 flex flex-wrap justify-center gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={cn(
                                "rounded-full px-6 py-2 text-sm font-medium transition-colors",
                                activeCategory === category
                                    ? "bg-primary text-black"
                                    : "bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            )}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* FAQ Accordion */}
                <div className="mx-auto max-w-3xl space-y-4">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq) => (
                            <div
                                key={faq.id}
                                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                            >
                                <button
                                    onClick={() =>
                                        setOpenQuestion(openQuestion === faq.id ? null : faq.id)
                                    }
                                    className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                >
                                    <span className="pr-4 font-bold text-zinc-900 dark:text-zinc-50">
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        className={cn(
                                            "h-5 w-5 shrink-0 text-zinc-500 transition-transform dark:text-zinc-400",
                                            openQuestion === faq.id && "rotate-180"
                                        )}
                                    />
                                </button>
                                {openQuestion === faq.id && (
                                    <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
                                        <p className="text-zinc-600 dark:text-zinc-400">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                            <p className="text-zinc-500 dark:text-zinc-400">
                                No questions found matching your search.
                            </p>
                        </div>
                    )}
                </div>

                {/* Contact CTA */}
                <div className="mx-auto mt-16 max-w-2xl rounded-3xl bg-gradient-to-r from-primary to-orange-600 p-12 text-center">
                    <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
                        Still have questions?
                    </h2>
                    <p className="mb-6 text-lg text-white/90">
                        Can't find the answer you're looking for? Our customer support team is here to help.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="rounded-full bg-white text-primary hover:bg-zinc-100"
                    >
                        <a href="mailto:support@vaanra.com">Contact Us</a>
                    </Button>
                </div>
            </div>
        </div>
    );
}
