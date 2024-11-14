"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Tour } from "@/types";

interface CartItem extends Tour {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (tour: Tour) => void;
  removeFromCart: (tourId: string) => void;
  updateQuantity: (tourId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (tour: Tour) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === tour.id);
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === tour.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { ...tour, quantity: 1 }];
    });
  };

  const removeFromCart = (tourId: string) => {
    setItems((currentItems) => 
      currentItems.filter((item) => item.id !== tourId)
    );
  };

  const updateQuantity = (tourId: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === tourId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}; 