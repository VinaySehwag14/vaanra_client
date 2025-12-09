/**
 * Wishlist types
 */

export interface WishlistProduct {
    name: string;
    selling_price: number;
    image: string;
}

export interface WishlistItem {
    product_id: number;
    product: WishlistProduct;
}

/**
 * Response from getting wishlist
 */
export interface WishlistResponse {
    success: boolean;
    wishlist: WishlistItem[];
}

/**
 * Response from adding/removing from wishlist
 */
export interface WishlistActionResponse {
    success: boolean;
    message: string;
}
