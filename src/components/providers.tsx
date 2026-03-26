"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { AuthModal } from "@/components/auth/auth-modal";

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <AuthProvider>
            <CartProvider>
                {children}
                <AuthModal />
            </CartProvider>
        </AuthProvider>
    );
}
