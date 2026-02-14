import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export function useCheckout() {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const goToCheckout = (pkg, platform, serviceLabel, quantityKey = 'views') => {
    const amount = pkg[quantityKey] ?? pkg.quantity ?? pkg.views ?? pkg.likes ?? pkg.subscribers ?? pkg.hours ?? '0';
    const price = typeof pkg.price === 'string' ? pkg.price : String(pkg.price || 0);
    const params = new URLSearchParams({
      platform,
      service: serviceLabel || `${platform} - ${amount}`,
      amount: String(amount),
      price,
    });
    navigate(`/checkout?${params.toString()}`);
  };

  const addToCartWithPlatform = (item, platform) => {
    addToCart({ ...item, platform });
  };

  return { goToCheckout, addToCartWithPlatform, isLoggedIn };
}
