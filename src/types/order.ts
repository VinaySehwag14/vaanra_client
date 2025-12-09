// Order types and interfaces
export type OrderStatus = "pending" | "delivered" | "processing" | "shipped" | "cancelled";

export interface Order {
    id: string;
    orderNumber: string;
    date: string;
    status: OrderStatus;
    total: number;
    items: OrderItem[];
}

export interface OrderItem {
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
}

export const ORDER_STATUS_CONFIG: Record<
    OrderStatus,
    { label: string; color: string; bgColor: string }
> = {
    pending: {
        label: "Pending",
        color: "text-orange-600 dark:text-orange-400",
        bgColor: "bg-orange-100 dark:bg-orange-950/20",
    },
    delivered: {
        label: "Delivered",
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-100 dark:bg-green-950/20",
    },
    processing: {
        label: "Processing",
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-100 dark:bg-yellow-950/20",
    },
    shipped: {
        label: "Shipped",
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-950/20",
    },
    cancelled: {
        label: "Cancelled",
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-100 dark:bg-red-950/20",
    },
};

/**
 * Order item for API
 */
export interface ApiOrderItem {
    product_name: string;
    quantity: number;
    price: number;
}

/**
 * Order from API response
 */
export interface ApiOrder {
    id: number;
    total_amount: number;
    discount_amount: number;
    final_amount: number;
    status: OrderStatus;
    items: ApiOrderItem[];
    created_at?: string;
}

/**
 * Shipping address for order
 */
export interface ShippingAddress {
    full_name: string;
    name?: string; // Legacy field
    email?: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    landmark?: string;
}

/**
 * Order item request
 */
export interface OrderItemRequest {
    variant_id: number;
    quantity: number;
}

/**
 * Request body for creating an order
 */
export interface CreateOrderRequest {
    items: OrderItemRequest[];
    shipping_address: ShippingAddress;
    payment_method: "cod" | "online";
    coupon_code?: string;
}

/**
 * Response from creating an order
 */
export interface CreateOrderResponse {
    success: boolean;
    message: string;
    order_id: number;
}

/**
 * Response from getting user orders
 */
export interface OrdersResponse {
    success: boolean;
    orders: ApiOrder[];
}

