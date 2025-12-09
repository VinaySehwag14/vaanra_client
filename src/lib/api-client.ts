import { User } from "firebase/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";


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

    // Add more API methods here as needed
}
