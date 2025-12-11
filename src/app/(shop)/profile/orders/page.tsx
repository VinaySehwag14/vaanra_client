"use client";

import { useState, useMemo, useEffect } from "react";
import ProfileSidebar from "@/components/profile/profile-sidebar";
import OrderSearchBar from "@/components/orders/order-search-bar";
import OrderStatusFilter from "@/components/orders/order-status-filter";
import OrderCard from "@/components/orders/order-card";
import Pagination from "@/components/orders/pagination";
import { Order, OrderStatus } from "@/types/order";
import { useAuth } from "@/hooks/useAuth";
import { ApiClient } from "@/lib/api-client";

const ORDERS_PER_PAGE = 5; // Increased per page count

export default function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeStatus, setActiveStatus] = useState<OrderStatus | "all">("all");
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch orders from API
    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await ApiClient.getUserOrders(user);

                if (response.success && response.orders) {
                    // Map API orders to UI Order type
                    const mappedOrders: Order[] = response.orders.map((apiOrder: any) => ({
                        id: apiOrder.id.toString(),
                        orderNumber: `UF-${String(apiOrder.id).padStart(6, '0')}`, // Format: UF-000123
                        date: new Date(apiOrder.created_at || Date.now()).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }),
                        status: (apiOrder.status || "processing") as OrderStatus,
                        total: apiOrder.final_amount,
                        items: apiOrder.items.map((item: any) => ({
                            id: item.id?.toString() || Math.random().toString(),
                            name: item.product_name,
                            image: item.product_image || item.image || "/placeholder-product.jpg",
                            quantity: item.quantity,
                            price: item.price,
                            slug: item.slug || item.product_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                        }))
                    }));

                    // Sort by newest first
                    setOrders(mappedOrders.reverse());
                }
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    // Filter orders based on search and status
    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchesSearch =
                searchQuery === "" ||
                order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.id.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus =
                activeStatus === "all" || order.status === activeStatus;

            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, activeStatus, orders]);

    // Paginate orders
    const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
        return filteredOrders.slice(startIndex, startIndex + ORDERS_PER_PAGE);
    }, [filteredOrders, currentPage]);

    // Reset to page 1 when filters change
    const handleStatusChange = (status: OrderStatus | "all") => {
        setActiveStatus(status);
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
                <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
                    <div className="flex flex-col gap-8 lg:flex-row">
                        <ProfileSidebar />
                        <div className="flex-1 flex items-center justify-center min-h-[400px]">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-900 border-t-transparent dark:border-zinc-50" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 pb-20 dark:bg-zinc-950">
            <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Sidebar */}
                    <ProfileSidebar />

                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        {/* Header */}
                        <div>
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                                Order History
                            </h1>
                            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                                Review your past purchases and track your shipments.
                            </p>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="w-full sm:w-96">
                                <OrderSearchBar
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <OrderStatusFilter
                                activeStatus={activeStatus}
                                onStatusChange={handleStatusChange}
                            />
                        </div>

                        {/* Orders List */}
                        <div className="space-y-4">
                            {paginatedOrders.length > 0 ? (
                                paginatedOrders.map((order) => (
                                    <OrderCard key={order.id} order={order} />
                                ))
                            ) : (
                                <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                                    <p className="text-zinc-500 dark:text-zinc-400">
                                        No orders found matching your criteria.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
