// Cart item types (UI)
export interface CartItem {
    id: string;
    name: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    image: string;
}

/**
 * Cart item from API response
 */
export interface ApiCartItem {
    cart_item_id: number;
    variant_id: number;
    product_id: number;
    product_name: string;
    product_slug: string;
    product_image: string;
    sku_code: string;
    color: string;
    size: string;
    price: number;
    mrp: number;
    quantity: number;
    stock_available: number;
    in_stock: boolean;
    item_total: number;
    is_active: boolean;
}

/**
 * Cart summary from API
 */
export interface CartSummary {
    items_count: number;
    total_quantity: number;
    subtotal: number;
    total: number;
}

/**
 * Cart response from API
 */
export interface CartResponse {
    success: boolean;
    cart: {
        items: ApiCartItem[];
        summary: CartSummary;
    };
}

/**
 * Request body for adding to cart
 */
export interface AddToCartRequest {
    variant_id: number;
    quantity: number;
}

/**
 * Response from adding to cart
 */
export interface AddToCartResponse {
    success: boolean;
    message: string;
    cart_item_id?: number;
}

