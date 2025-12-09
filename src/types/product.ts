/**
 * Product image structure from API
 */
export interface ProductImage {
    url: string;
    sort_order: number;
}

/**
 * Product variant structure from API
 */
export interface ProductVariant {
    id: string;
    size?: string;
    color?: string;
    stock: number;
    price?: number;
}

/**
 * Product data structure from the API
 */
export interface ApiProduct {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    sale_price?: number;
    category_id: string;
    category_name?: string;
    images: ProductImage[];
    stock: number;
    variants?: ProductVariant[];
    is_featured: boolean;
    is_new: boolean;
    is_on_sale: boolean;
    discount_percentage?: number;
    created_at: string;
    updated_at: string;
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
    // Find image with sort_order 1, or fallback to first image, or placeholder
    let imageUrl = "/placeholder-product.jpg";
    if (apiProduct.images && Array.isArray(apiProduct.images) && apiProduct.images.length > 0) {
        // Try to find image with sort_order 1
        const primaryImage = apiProduct.images.find(img => img.sort_order === 1);
        if (primaryImage && primaryImage.url) {
            imageUrl = primaryImage.url;
        } else if (apiProduct.images[0] && apiProduct.images[0].url) {
            // Fallback to first image if no sort_order 1 found
            imageUrl = apiProduct.images[0].url;
        }
    }

    const product: Product = {
        id: apiProduct.id,
        slug: apiProduct.slug,
        title: apiProduct.name,
        price: apiProduct.sale_price || apiProduct.price,
        image: imageUrl,
    };

    // Add original price if on sale
    if (apiProduct.is_on_sale && apiProduct.sale_price) {
        product.originalPrice = apiProduct.price;
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
