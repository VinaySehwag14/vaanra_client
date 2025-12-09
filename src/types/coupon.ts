/**
 * Coupon types for promotional codes
 */

export type CouponType = "percentage" | "fixed";

export interface Coupon {
    id: number;
    code: string;
    type: CouponType;
    value: number;
    min_cart_value?: number;
    max_discount?: number;
    start_date?: string;
    end_date?: string;
    usage_limit?: number;
    is_active: boolean;
}

/**
 * Request body for creating a coupon (Admin)
 */
export interface CreateCouponRequest {
    code: string;
    type: CouponType;
    value: number;
    min_cart_value?: number;
    max_discount?: number;
    start_date?: string;
    end_date?: string;
    usage_limit?: number;
}

/**
 * Request body for validating a coupon
 */
export interface ValidateCouponRequest {
    code: string;
    cartTotal: number;
}

/**
 * Response from coupon validation
 */
export interface ValidateCouponResponse {
    success: boolean;
    coupon_id: number;
    code: string;
    discount_amount: number;
}

/**
 * Response from creating a coupon
 */
export interface CreateCouponResponse {
    success: boolean;
    coupon: Coupon;
}
