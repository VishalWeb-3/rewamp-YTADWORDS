import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useGlobalContent } from '../contexts/ContentContext';

export default function CartSidebar() {
  const globalContent = useGlobalContent();
  const cart = globalContent?.cart || {};
  const {
    cartItems,
    removeFromCart,
    isCartOpen,
    setIsCartOpen,
    getCartTotal,
  } = useCart();

  // Escape closes the drawer
  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e) => e.key === 'Escape' && setIsCartOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div role="dialog" aria-modal="true" aria-labelledby="cart-title" className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="cart-title" className="text-2xl font-bold text-gray-900">{cart.title || 'Your Cart'}</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            autoFocus
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg
                className="w-24 h-24 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{cart.emptyTitle || 'Your cart is empty'}</h3>
              <p className="text-gray-600 mb-6">{cart.emptySubtext || 'Add services to get started'}</p>
              <Link
                to="/"
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-3 bg-brand-red text-white font-semibold rounded-lg hover:bg-[#C62828] transition-colors"
              >
                {cart.browseServices || 'Browse Services'}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.serviceName || item.serviceType}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        {item.type && (
                          <p>
                            <span className="font-medium">Type:</span> {item.type}
                          </p>
                        )}
                        {item.quantity && (
                          <p>
                            <span className="font-medium">Quantity:</span> {item.quantity}
                          </p>
                        )}
                        {item.url && (
                          <p className="truncate">
                            <span className="font-medium">URL:</span> {item.url}
                          </p>
                        )}
                      </div>
                      <p className="text-lg font-bold text-brand-red mt-2">
                        ${item.price}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 p-2 hover:bg-red-100 rounded-full transition-colors"
                      title="Remove item"
                      aria-label={`Remove ${item.serviceName || item.serviceType} from cart`}
                    >
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-brand-red">
                ${getCartTotal().toFixed(2)}
              </span>
            </div>
            <Link
              to="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="block w-full bg-brand-red text-white font-bold py-4 rounded-lg hover:bg-[#C62828] transition-colors text-center text-lg"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/"
              onClick={() => setIsCartOpen(false)}
              className="block w-full mt-3 text-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
