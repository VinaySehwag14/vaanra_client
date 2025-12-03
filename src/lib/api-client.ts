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

    static async syncUser(user: User) {
        try {
            const headers = await this.getAuthHeaders(user);
            const response = await fetch(`${API_URL}/api/auth/sync`, {
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

    // Add more API methods here as needed
}
