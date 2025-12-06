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

    // Add more API methods here as needed
}
