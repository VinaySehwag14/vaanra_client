"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ApiClient } from "@/lib/api-client";
import { ApiCartItem, CartSummary } from "@/types/cart";

interface CartContextType {
    cartItems: ApiCartItem[];
    cartSummary: CartSummary | null;
    cartCount: number;
    isLoading: boolean;
    error: string | null;
    addToCart: (variantId: number, quantity?: number) => Promise<boolean>;
    updateQuantity: (cartItemId: number, quantity: number) => Promise<boolean>;
    removeItem: (cartItemId: number) => Promise<boolean>;
    refreshCart: () => Promise<void>;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState<ApiCartItem[]>([]);
    const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Calculate cart count
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Fetch cart from API
    const refreshCart = useCallback(async () => {
        if (!user) {
            setCartItems([]);
            setCartSummary(null);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const response = await ApiClient.getCart(user);

            if (response.success && response.cart) {
                setCartItems(response.cart.items || []);
                setCartSummary(response.cart.summary || null);
            }
        } catch (err) {
            console.error("Failed to fetch cart:", err);
            setError("Failed to load cart");
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    // Fetch cart when user changes
    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    // Add item to cart
    const addToCart = useCallback(async (variantId: number, quantity: number = 1): Promise<boolean> => {
        if (!user) {
            setError("Please log in to add items to cart");
            return false;
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await ApiClient.addToCart(user, { variant_id: variantId, quantity });

            if (response.success) {
                await refreshCart(); // Refresh cart to get updated data
                return true;
            } else {
                setError(response.message || "Failed to add item to cart");
                return false;
            }
        } catch (err: any) {
            console.error("Failed to add to cart:", err);
            setError(err.message || "Failed to add item to cart");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [user, refreshCart]);

    // Update item quantity
    const updateQuantity = useCallback(async (cartItemId: number, quantity: number): Promise<boolean> => {
        if (!user) {
            setError("Please log in to update cart");
            return false;
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await ApiClient.updateCartItem(user, cartItemId, quantity);

            if (response.success) {
                await refreshCart();
                return true;
            } else {
                setError(response.message || "Failed to update cart");
                return false;
            }
        } catch (err: any) {
            console.error("Failed to update cart item:", err);
            setError(err.message || "Failed to update cart");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [user, refreshCart]);

    // Remove item from cart
    const removeItem = useCallback(async (cartItemId: number): Promise<boolean> => {
        if (!user) {
            setError("Please log in to remove items");
            return false;
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await ApiClient.removeCartItem(user, cartItemId);

            if (response.success) {
                await refreshCart();
                return true;
            } else {
                setError(response.message || "Failed to remove item");
                return false;
            }
        } catch (err: any) {
            console.error("Failed to remove cart item:", err);
            setError(err.message || "Failed to remove item");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [user, refreshCart]);

    // Clear cart (client-side only, used after order completion)
    const clearCart = useCallback(() => {
        setCartItems([]);
        setCartSummary(null);
    }, []);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartSummary,
                cartCount,
                isLoading,
                error,
                addToCart,
                updateQuantity,
                removeItem,
                refreshCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
