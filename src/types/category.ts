/**
 * Category data structure from the API
 */
export interface Category {
    id: string;
    name: string;
    image: string;
    created_at: string;
}

/**
 * API response structure for category endpoints
 */
export interface CategoryResponse {
    success: boolean;
    count: number;
    categories: Category[];
}
