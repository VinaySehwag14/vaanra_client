/**
 * Category data structure from the API
 */
export interface Category {
    id: string;
    name: string;
    slug?: string;
    description?: string;
    image_url?: string;
    parent_id?: string | null;
    created_at?: string;
    // Legacy field
    image?: string;
}

/**
 * API response structure for category endpoints
 */
export interface CategoryResponse {
    success: boolean;
    count?: number;
    categories: Category[];
}

/**
 * Request body for creating a category (Admin)
 */
export interface CreateCategoryRequest {
    name: string;
    description?: string;
    image_url?: string;
    parent_id?: string | null;
}

/**
 * Response from creating a category
 */
export interface CreateCategoryResponse {
    success: boolean;
    message?: string;
    category?: Category;
}

