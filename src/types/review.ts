/**
 * Review types for product reviews
 */

export interface ReviewUser {
    name: string;
}

export interface Review {
    id: number;
    rating: number;
    comment: string;
    user: ReviewUser;
    created_at?: string;
}

/**
 * Request body for adding a review
 */
export interface AddReviewRequest {
    product_id: number;
    rating: number;
    comment: string;
}

/**
 * Response from getting product reviews
 */
export interface ReviewsResponse {
    success: boolean;
    reviews: Review[];
}

/**
 * Response from adding a review
 */
export interface AddReviewResponse {
    success: boolean;
    message: string;
    review?: Review;
}
