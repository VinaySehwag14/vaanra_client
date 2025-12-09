/**
 * Banner data structure from the API
 */
export interface Banner {
    id: string;
    title: string;
    sub_text: string;
    image: string;
    link: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * API response structure for banner endpoints
 */
export interface BannerResponse {
    success: boolean;
    count: number;
    banners: Banner[];
}
