import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Updated Interface for TypeScript
export interface CartItem {
    _id: string;
    cartItemId: string; // Unique composite ID: productId-size
    name: string;
    price: number;
    image: string;
    quantity: number;
    size: string;
    
    // Optional legacy fields to prevent TypeScript build errors
    imageUrl?: string; 
    images?: string[]; 
}

interface CartState {
    items: CartItem[];
    // 2. Updated addToCart signature to expect the second size argument
    addToCart: (product: any, selectedSize?: string) => void;
    removeFromCart: (cartItemId: string) => void;
    decreaseQuantity: (cartItemId: string) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            addToCart: (product, selectedSize) => set((state) => {
                // Determine the size (fallback to 'N/A' if sizing wasn't provided)
                const size = selectedSize || product.size || 'N/A';
                
                // Create a unique composite ID based on the product ID and the size
                const cartItemId = `${product._id}-${size}`;
                
                // Safely extract the best available image from the new array or legacy fields
                const image = product.images?.[0] || product.image || product.imageUrl || "";

                const existingItem = state.items.find(item => item.cartItemId === cartItemId);

                if (existingItem) {
                    return {
                        items: state.items.map(item => 
                            item.cartItemId === cartItemId 
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        )
                    };
                }

                return {
                    items: [...state.items, { 
                        _id: product._id,
                        cartItemId,
                        name: product.name,
                        price: product.price,
                        image,
                        quantity: 1,
                        size
                    }]
                };
            }),
            removeFromCart: (cartItemId) => set((state) => ({
                items: state.items.filter(item => item.cartItemId !== cartItemId)
            })),
            decreaseQuantity: (cartItemId) => set((state) => ({
                items: state.items.map(item => {
                    if (item.cartItemId === cartItemId && item.quantity > 1) {
                        return { ...item, quantity: item.quantity - 1 };
                    }
                    return item;
                })
            })),
            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'vihan-cart-storage', // Premium storage key
        }
    )
);