"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/context/cart-context";

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <CartProvider>
            {children}
        </CartProvider>
    );
}
