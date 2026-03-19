import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface CartItem {
    productId: string;
    quantity: number;
    color?: string;
}

interface CartContextType {
    items: CartItem[];
    totalItems: number;
    addToCart: (productId: string, quantity: number, color?: string) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);
const LS_CART_KEY = 'modi_cart';

function loadCart(): CartItem[] {
    try { return JSON.parse(localStorage.getItem(LS_CART_KEY) || '[]'); } catch { return []; }
}
function saveCart(items: CartItem[]) {
    localStorage.setItem(LS_CART_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(loadCart);

    const addToCart = useCallback((productId: string, quantity: number, color?: string) => {
        setItems(prev => {
            const existing = prev.find(i => i.productId === productId);
            const next = existing
                ? prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i)
                : [...prev, { productId, quantity, color }];
            saveCart(next);
            return next;
        });
    }, []);

    const removeFromCart = useCallback((productId: string) => {
        setItems(prev => {
            const next = prev.filter(i => i.productId !== productId);
            saveCart(next);
            return next;
        });
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        setItems(prev => {
            const next = quantity <= 0
                ? prev.filter(i => i.productId !== productId)
                : prev.map(i => i.productId === productId ? { ...i, quantity } : i);
            saveCart(next);
            return next;
        });
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
        saveCart([]);
    }, []);

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, totalItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
