"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

import type { CartItem } from "../types/cart";

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");

      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (error) {
      console.error("No se ha podido cargar el carrito:", error);
      setCart([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, loaded]);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);

      if (existing) {
        return prev.map((p) =>
          p.id === item.id
            ? {
                ...p,
                quantity: p.quantity + item.quantity,
              }
            : p
        );
      }

      return [...prev, { ...item }];
    });
  }, []);

  const increaseQuantity = useCallback((id: string) => {
    setCart((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              quantity: p.quantity + 1,
            }
          : p
      )
    );
  }, []);

  const decreaseQuantity = useCallback((id: string) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p.id === id
            ? {
                ...p,
                quantity: p.quantity - 1,
              }
            : p
        )
        .filter((p) => p.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) =>
      prev.filter((p) => p.id !== id)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart debe usarse dentro de CartProvider"
    );
  }

  return context;
}