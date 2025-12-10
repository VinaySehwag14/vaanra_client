/**
 * Product category structure from API
 */
export interface ProductCategory {
    id: string;
    name: string;
}

/**
 * Product image structure from API
 */
export interface ProductImage {
    image_url: string;
    is_primary: boolean;
    // Legacy fields for backwards compatibility
    url?: string;
    sort_order?: number;
}

/**
 * Product variant structure from API
 */
export interface ProductVariant {
    id?: string;
    color: string;
    size: string;
    stock_quantity: number;
    sku_code: string;
    // Legacy fields for backwards compatibility
    stock?: number;
    price?: number;
}

/**
 * Variant input for creating products
 */
export interface ProductVariantInput {
    color: string;
    size: string;
    stock_quantity: number;
    sku_code: string;
}

/**
 * Image input for creating products
 */
export interface ProductImageInput {
    image_url: string;
    is_primary: boolean;
}

/**
 * Product data structure from the API
 */
export interface ApiProduct {
    id: number | string;
    slug: string;
    name: string;
    description?: string;
    brand?: string;
    selling_price: number;
    mrp: number;
    categories?: ProductCategory[];
    images: ProductImage[];
    variants?: ProductVariant[];
    is_featured?: boolean;
    is_new?: boolean;
    is_on_sale?: boolean;
    discount_percentage?: number;
    created_at?: string;
    updated_at?: string;
    // Legacy fields for backwards compatibility
    price?: number;
    sale_price?: number;
    category_id?: string;
    category_name?: string;
    stock?: number;
}

/**
 * Request body for creating a product (Admin)
 */
export interface CreateProductRequest {
    name: string;
    description?: string;
    brand?: string;
    mrp: number;
    selling_price: number;
    category_ids?: string[];
    tag_ids?: number[];
    variants: ProductVariantInput[];
    images: ProductImageInput[];
}

/**
 * Response from creating a product
 */
export interface CreateProductResponse {
    success: boolean;
    message: string;
    productId: number;
    slug: string;
}

/**
 * API response structure for product endpoints
 */
export interface ProductResponse {
    success: boolean;
    count: number;
    products: ApiProduct[];
}

/**
 * Product interface for UI components (compatible with existing ProductCard)
 */
export interface Product {
    id: string;
    slug: string;
    title: string;
    price: number;
    originalPrice?: number;
    image: string;
    badge?: {
        text: string;
        color: "new" | "sale" | "hot";
    };
}

/**
 * Helper function to convert API product to UI product
 */
export function mapApiProductToProduct(apiProduct: ApiProduct): Product {
    // Find primary image - handle both new format (is_primary) and legacy format (sort_order)
    let imageUrl = "/placeholder-product.jpg";
    if (apiProduct.images && Array.isArray(apiProduct.images) && apiProduct.images.length > 0) {
        // Try new format first (is_primary)
        const primaryImage = apiProduct.images.find(img => img.is_primary);
        if (primaryImage && primaryImage.image_url) {
            imageUrl = primaryImage.image_url;
        } else {
            // Try legacy format (sort_order)
            const legacyPrimary = apiProduct.images.find(img => img.sort_order === 1);
            if (legacyPrimary && legacyPrimary.url) {
                imageUrl = legacyPrimary.url;
            } else if (apiProduct.images[0]) {
                // Fallback to first image
                imageUrl = apiProduct.images[0].image_url || apiProduct.images[0].url || imageUrl;
            }
        }
    }

    // Handle both new API (selling_price/mrp) and legacy (price/sale_price)
    const currentPrice = apiProduct.selling_price ?? apiProduct.sale_price ?? apiProduct.price ?? 0;
    const originalMrp = apiProduct.mrp ?? apiProduct.price ?? currentPrice;

    const product: Product = {
        id: String(apiProduct.id),
        slug: apiProduct.slug,
        title: apiProduct.name,
        price: currentPrice,
        image: imageUrl,
    };

    // Add original price if on sale
    if (apiProduct.is_on_sale && currentPrice < originalMrp) {
        product.originalPrice = originalMrp;
    }

    // Add badge
    if (apiProduct.is_new) {
        product.badge = { text: "NEW", color: "new" };
    } else if (apiProduct.is_on_sale) {
        product.badge = {
            text: `${apiProduct.discount_percentage || 0}% OFF`,
            color: "sale"
        };
    } else if (apiProduct.is_featured) {
        product.badge = { text: "HOT", color: "hot" };
    }

    return product;
}
