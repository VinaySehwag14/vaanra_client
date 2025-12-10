import { User } from "firebase/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export class ApiClient {
    private static async getAuthHeaders(user: User | null) {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (user) {
            const token = await user.getIdToken();
            headers["Authorization"] = `Bearer ${token}`;
        }

        return headers;
    }

    /**
     * Check if user exists in the database
     * @param user Firebase user object
     * @returns Promise<boolean> - true if user exists, false otherwise
     */
    static async checkUserExists(user: User): Promise<boolean> {
        try {
            const headers = await this.getAuthHeaders(user);
            const response = await fetch(`${API_URL}/api/v1/users/verify`, {
                method: "GET",
                headers,
            });

            if (response.status === 404) {
                return false;
            }

            if (!response.ok) {
                throw new Error(`Failed to verify user: ${response.statusText}`);
            }

            return true;
        } catch (error) {
            console.error("Error checking user existence:", error);
            return false;
        }
    }

    /**
     * Verify user exists in database and sync their data
     * @param user Firebase user object
     * @returns Promise<any> - User data from backend
     * @throws Error if user doesn't exist in database
     */
    static async verifyAndSyncUser(user: User) {
        try {
            const userExists = await this.checkUserExists(user);

            if (!userExists) {
                throw new Error("USER_NOT_FOUND");
            }

            // User exists, proceed with sync
            return await this.syncUser(user);
        } catch (error) {
            console.error("Error verifying and syncing user:", error);
            throw error;
        }
    }

    static async syncUser(user: User) {
        try {
            const headers = await this.getAuthHeaders(user);
            const response = await fetch(`${API_URL}/api/v1/auth/sync`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    uid: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to sync user: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error syncing user with backend:", error);
            throw error;
        }
    }

    /**
     * Register a new user in the backend
     * @param user Firebase user object
     * @returns Promise<any> - User data from backend
     */
    static async registerUser(user: User) {
        try {
            const headers = await this.getAuthHeaders(user);
            const response = await fetch(`${API_URL}/api/v1/auth/register`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    uid: user.uid,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to register user: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error registering user with backend:", error);
            throw error;
        }
    }

    /**
     * Fetch all active banners
     * @returns Promise<BannerResponse> - Banner data from backend
     */
    static async getBanners() {
        try {
            const response = await fetch(`${API_URL}/api/v1/banners/all`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch banners: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching banners:", error);
            throw error;
        }
    }

    /**
     * Fetch all categories (public endpoint)
     * @returns Promise<CategoryResponse> - Category data from backend
     */
    static async getCategories() {
        try {
            const response = await fetch(`${API_URL}/api/v1/categories`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch categories: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw error;
        }
    }

    /**
     * Fetch all products (public endpoint)
     * @param params Optional query parameters for filtering
     * @returns Promise<ProductResponse> - Product data from backend
     */
    static async getProducts(params?: {
        category?: string;
        featured?: boolean;
        onSale?: boolean;
        limit?: number;
    }) {
        try {
            // Build query string
            const queryParams = new URLSearchParams();
            if (params?.category) queryParams.append("category", params.category);
            if (params?.featured !== undefined) queryParams.append("featured", String(params.featured));
            if (params?.onSale !== undefined) queryParams.append("on_sale", String(params.onSale));
            if (params?.limit) queryParams.append("limit", String(params.limit));

            const queryString = queryParams.toString();
            const url = `${API_URL}/api/v1/products/all${queryString ? `?${queryString}` : ""}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    }

    /**
     * Fetch a single product by slug (public endpoint)
     * @param slug Product slug
     * @returns Promise<ApiProduct> - Single product data from backend
     */
    static async getProductBySlug(slug: string) {
        try {
            const response = await fetch(`${API_URL}/api/v1/products/${slug}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch product: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching product:", error);
            throw error;
        }
    }

    // ============================================
    // PRODUCTS API (Admin)
    // ============================================

    /**
     * Create a new product (Admin)
     * @param user Firebase user object (admin)
     * @param data Product data
     * @returns Promise<CreateProductResponse>
     */
    static async createProduct(user: User, data: {
        name: string;
        description?: string;
        brand?: string;
        mrp: number;
        selling_price: number;
        category_ids?: string[];
        tag_ids?: number[];
        variants: { color: string; size: string; stock_quantity: number; sku_code: string }[];
        images: { image_url: string; is_primary: boolean }[];
    }) {
        try {
            const headers = await this.getAuthHeaders(user);
            const response = await fetch(`${API_URL}/api/v1/products/add`, {
                method: "POST",
                headers,
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to create product: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    }

    // ============================================
    // ORDERS API
    // ============================================

    /**
     * Create a new order
     * @param user Firebase user object
     * @param data Order data
     * @returns Promise<CreateOrderResponse>
     */
    static async createOrder(user: User, data: {
        items: { variant_id: number; quantity: number }[];
        shipping_address: {
            full_name: string;
            street: string;
            city: string;
            state: string;
            pincode: string;
            phone: string;
            email?: string;
            landmark?: string;
        };
        payment_method: "cod" | "online";
        coupon_code?: string;
    }) {
        try {
            const headers = await this.getAuthHeaders(user);
            const response = await fetch(`${API_URL}/api/v1/orders`, {
                method: "POST",
                headers,
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to create order: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    }

    /**
     * Get user's orders
     * @param user Firebase user object
     * @returns Promise<OrdersResponse>
     */
    static async getUserOrders(user: User) {
        try {
            const headers = await this.getAuthHeaders(user);
            const response = await fetch(`${API_URL}/api/v1/orders`, {
                method: "GET",
                headers,
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch orders: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    }

    // ============================================
    // COUPONS API
    // ============================================

    /**
     * Create a coupon (Admin)
     * @param user Firebase user object (admin)
     * @param data Coupon data
     * @returns Promise<CreateCouponResponse>
     */
    static async createCoupon(user: User, data: {
        code: string;
        type: "percentage" | "fixed";
        value: number;
        min_cart_value?: number;
        max_discount?: number;
        start_date?: string;
        end_date?: string;
        usage_limit?: number;
    }) {
        try {
            const headers = await this.getAuthHeaders(user);
            const response = await fetch(`${API_URL}/api/v1/coupons`, {
                method: "POST",
                headers,
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to create coupon: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error creating coupon:", error);
            throw error;
        }
    }

    /**
     * Validate a coupon
     * @param code Coupon code
     * @param cartTotal Cart total amount
     * @returns Promise<ValidateCouponResponse>
     */
    static async validateCoupon(code: string, cartTotal: number) {
        try {
            const response = await fetch(`${API_URL}/api/v1/coupons/validate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code, cartTotal }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to validate coupon: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error validating coupon:", error);
            throw error;
        }
    }

    // ============================================
    // CART API
    // ============================================

    /**
     * Get user's cart
     * @param user Firebase user object
     * @returns Promise<CartResponse>
     */
    static async getCart(user: User) {
        try {
            const headers = await this.getAuthHeaders(user);
            const response = await fetch(`${API_URL}/api/v1/cart`, {
                method: "GET",
                headers,
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch cart: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching cart:", error);
            throw error;
        }
    }

    /**
     * Add item to cart
     * @param user Firebase user object
     * @param data Cart item data
     * @returns Promise<AddToCartResponse>
     */
    static async addToCart(user: User, data: { variant_id: number; quantity: number }) {
        try {
            const headers = await this.getAuthHeaders(user);
            const response = await fetch(`${API_URL}/api/v1/cart`, {
                method: "POST",
                headers,
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to add to cart: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error adding to cart:", error);
            throw error;
        }
    }

    /**
     * Update cart item quantity
     * @param user Firebase user object
     * @param cartItemId Cart item ID
     * @param quantity New quantity
     * @returns Promise<any>
     */
    static async updateCartItem(user: User, cartItemId: number, quantity: number) {
        try {
            const headers = await this.getAuthHeaders(user);
            const response = await fetch(`${API_URL}/api/v1/cart/${cartItemId}`, {
                method: "PATCH",
                headers,
                body: JSON.stringify({ quantity }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to update cart: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error updating cart item:", error);
            throw error;
        }
    }

    /**
     * Remove item from cart
     * @param user Firebase user object
     * @param cartItemId Cart item ID
     * @returns Promise<any>
     */
    static async removeCartItem(user: User, cartItemId: number) {
        try {
            const headers = await this.getAuthHeaders(user);
            const response = await fetch(`${API_URL}/api/v1/cart/${cartItemId}`, {
                method: "DELETE",
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to remove from cart: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error removing cart item:", error);
            throw error;
        }
    }

    // ============================================
    // REVIEWS API
    // ============================================

    /**
     * Add a product review
     * @param user Firebase user object
     * @param data Review data
     * @returns Promise<AddReviewResponse>
     */
    static async addReview(user: User, data: { product_id: number; rating: number; comment: string }) {
        try {
            const headers = await this.getAuthHeaders(user);
            const response = await fetch(`${API_URL}/api/v1/reviews`, {
                method: "POST",
                headers,
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to add review: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error adding review:", error);
            throw error;
        }
    }

    /**
     * Get reviews for a product
     * @param productId Product ID
     * @returns Promise<ReviewsResponse>
     */
    static async getProductReviews(productId: number) {
        try {
            const response = await fetch(`${API_URL}/api/v1/reviews/product/${productId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch reviews: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching reviews:", error);
            throw error;
        }
    }

    // ============================================
    // CATEGORIES API (Admin)
    // ============================================

    /**
     * Create a category (Admin)
     * @param user Firebase user object (admin)
     * @param data Category data
     * @returns Promise<CreateCategoryResponse>
     */
    static async createCategory(user: User, data: {
        name: string;
        description?: string;
        image_url?: string;
        parent_id?: string | null;
    }) {
        try {
            const headers = await this.getAuthHeaders(user);
            const response = await fetch(`${API_URL}/api/v1/categories`, {
                method: "POST",
                headers,
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to create category: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error creating category:", error);
            throw error;
        }
    }

    // ============================================
    // TAGS API
    // ============================================

    /**
     * Create a tag (Admin)
     * @param user Firebase user object (admin)
     * @param data Tag data
     * @returns Promise<CreateTagResponse>
     */
    static async createTag(user: User, data: { name: string }) {
        try {
            const headers = await this.getAuthHeaders(user);
            const response = await fetch(`${API_URL}/api/v1/tags`, {
                method: "POST",
                headers,
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to create tag: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error creating tag:", error);
            throw error;
        }
    }

    /**
     * Get all tags
     * @returns Promise<TagsResponse>
     */
    static async getTags() {
        try {
            const response = await fetch(`${API_URL}/api/v1/tags`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch tags: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching tags:", error);
            throw error;
        }
    }

    // ============================================
    // WISHLIST API
    // ============================================

    /**
     * Add product to wishlist
     * @param user Firebase user object
     * @param productId Product ID
     * @returns Promise<WishlistActionResponse>
     */
    static async addToWishlist(user: User, productId: number) {
        try {
            const headers = await this.getAuthHeaders(user);
            const response = await fetch(`${API_URL}/api/v1/wishlist/${productId}`, {
                method: "POST",
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to add to wishlist: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            throw error;
        }
    }

    /**
     * Remove product from wishlist
     * @param user Firebase user object
     * @param productId Product ID
     * @returns Promise<WishlistActionResponse>
     */
    static async removeFromWishlist(user: User, productId: number) {
        try {
            const headers = await this.getAuthHeaders(user);
            const response = await fetch(`${API_URL}/api/v1/wishlist/${productId}`, {
                method: "DELETE",
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to remove from wishlist: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            throw error;
        }
    }

    /**
     * Get user's wishlist
     * @param user Firebase user object
     * @returns Promise<WishlistResponse>
     */
    static async getWishlist(user: User) {
        try {
            const headers = await this.getAuthHeaders(user);
            const response = await fetch(`${API_URL}/api/v1/wishlist`, {
                method: "GET",
                headers,
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch wishlist: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            throw error;
        }
    }

    // ============================================
    // PAYMENTS API
    // ============================================

    /**
     * Create a payment order
     * @param user Firebase user object
     * @param data Payment order data
     * @returns Promise<PaymentOrderResponse>
     */
    static async createPaymentOrder(user: User, data: {
        amount: number;
        currency: string;
        items: { variant_id: number; quantity: number }[];
    }) {
        try {
            const headers = await this.getAuthHeaders(user);
            const response = await fetch(`${API_URL}/api/v1/payments/create-order`, {
                method: "POST",
                headers,
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to create payment order: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error creating payment order:", error);
            throw error;
        }
    }
}

