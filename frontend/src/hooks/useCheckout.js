import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export function useCheckout() {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Buy now: go straight to checkout with a single package (not added to the cart)
  const goToCheckout = ({ slug, tier = 'regular', pkg, platform, serviceLabel, quantityKey = 'views' }) => {
    const quantity = pkg[quantityKey] ?? pkg.quantity ?? '0';
    navigate('/checkout', {
      state: {
        directItem: {
          id: 'direct',
          slug,
          tier,
          quantity: String(quantity),
          platform,
          service: serviceLabel || `${platform} - ${quantity}`,
          price: pkg.price,
        },
      },
    });
  };

  const addToCartWithPlatform = (item, platform) => {
    addToCart({ ...item, platform });
  };

  return { goToCheckout, addToCartWithPlatform, isLoggedIn };
}
