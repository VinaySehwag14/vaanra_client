/**
 * Payment types for payment processing
 */

export interface PaymentOrderItem {
    variant_id: number;
    quantity: number;
}

/**
 * Request body for creating a payment order
 */
export interface CreatePaymentOrderRequest {
    amount: number;
    currency: string;
    items: PaymentOrderItem[];
}

/**
 * Response from creating a payment order
 */
export interface PaymentOrderResponse {
    id: string;
    amount: number;
    currency: string;
}
