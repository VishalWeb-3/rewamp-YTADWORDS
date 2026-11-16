import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

function loadSavedCart() {
  try {
    const saved = JSON.parse(localStorage.getItem('cartItems') || '[]');
    // Items saved before package references were added can't be priced by the server
    return Array.isArray(saved) ? saved.filter((item) => item && item.slug) : [];
  } catch {
    return [];
  }
}

export const CartProvider = ({ children }) => {
  // Read the saved cart during the first render so the save effect never overwrites it with []
  const [cartItems, setCartItems] = useState(loadSavedCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    const newItem = {
      ...item,
      id: `${item.serviceType}-${item.quantity}-${item.type}-${Date.now()}`,
      addedAt: new Date().toISOString(),
    };
    setCartItems((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateCartItem = (itemId, updates) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, ...updates } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + parseFloat(item.price || 0), 0);
  };

  const getCartCount = () => {
    return cartItems.length;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    getCartTotal,
    getCartCount,
    isCartOpen,
    setIsCartOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
