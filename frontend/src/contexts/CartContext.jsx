import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  // Load cart and orders from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    const savedOrders = localStorage.getItem('orders');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save orders to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

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

  const createOrder = (orderData) => {
    const newOrder = {
      id: `ORDER-${Date.now()}`,
      ...orderData,
      items: [...cartItems],
      total: getCartTotal(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
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
    orders,
    createOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
