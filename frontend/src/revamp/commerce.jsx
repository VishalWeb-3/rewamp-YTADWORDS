// The revamp's purchase UI (components/Commerce.tsx), driven by this site's own state:
// packages from Tina pricing, the shared CartContext, and the same Buy now / Get started hand-off
// as the existing product pages. Markup and class names are the revamp's (styled by revamp.css).
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useGlobalContent, usePricingPackages, usePricingPageContent } from '../contexts/ContentContext';
import { useCtaActions } from '../contexts/CtaActionsContext';
import { useCheckout } from '../hooks/useCheckout';
import { SERVICES, TIER_KEYS, isPriced, money } from './services';

const Check = () => <svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3-4.2 4.2a1 1 0 0 1-1.4 0L6.3 11a1 1 0 1 1 1.4-1.4l1.1 1.1 3.5-3.5a1 1 0 0 1 1.4 1.4Z" /></svg>;
const BagIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 7h12l1 13H5L6 7Zm3 0V6a3 3 0 0 1 6 0v1" /></svg>;

/* ---------------- product page: tier tabs + package picker ---------------- */
export function PurchasePanel({ slug }) {
  const service = SERVICES[slug];
  const allPackages = usePricingPackages(slug, null);
  const content = usePricingPageContent(slug, null);
  const { addToCart } = useCart();
  const { goToCheckout } = useCheckout();
  const { isEnabled } = useCtaActions();
  const navigate = useNavigate();
  const [tierKey, setTierKey] = useState('regular');
  const [selected, setSelected] = useState(null);
  const [added, setAdded] = useState(false);
  const [barVisible, setBarVisible] = useState(false);
  const actionsRef = useRef(null);

  // Sticky phone buy bar appears once a package is chosen and the inline buttons scroll away.
  useEffect(() => {
    const el = actionsRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => setBarVisible(!entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!service || !allPackages) return null;
  const tabLabel = (key) => (service.tinaTabs && content?.tabs?.[key]) || service.tabs[key];
  const tiers = TIER_KEYS.filter((key) => service.tabs[key] && allPackages[key]?.length && (!service.onlyRegular || key === 'regular'));
  const tier = tiers.includes(tierKey) ? tierKey : tiers[0];
  const packages = allPackages[tier] || [];
  const pkg = selected !== null ? packages[selected] : null;
  const qty = (p) => p?.[service.quantityKey];
  const canBuy = !service.ctaSwitches || isEnabled('buy');
  const canAddToCart = !service.ctaSwitches || isEnabled('add_to_cart');

  const buyNow = () => {
    if (!pkg) return;
    if (service.contactForPrice && pkg.price === 'Contact for Price') { navigate('/contact'); return; }
    if (service.buy === 'checkout') {
      goToCheckout({ slug, tier, pkg, platform: service.platform, serviceLabel: `${service.serviceType} - ${qty(pkg)}`, quantityKey: service.quantityKey });
      return;
    }
    navigate('/get-started', {
      state: {
        slug,
        allPackages,
        serviceType: service.serviceType,
        typeLabels: service.startLabels,
        quantityKey: service.quantityKey,
        unitLabel: service.unitLabel,
        initialType: tier,
        initialPackage: pkg,
      },
    });
  };
  const addPackage = () => {
    if (!pkg) return;
    addToCart({
      slug,
      tier,
      ...(service.platform ? { platform: service.platform } : {}),
      serviceType: service.serviceType,
      serviceName: `${service.serviceType} - ${qty(pkg)}`,
      type: service.cartTypes[tier],
      quantity: qty(pkg),
      price: pkg.price,
      [service.quantityKey]: qty(pkg),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };
  const buyLabel = canBuy ? 'Buy now' : 'Buy disabled';
  const cartLabel = canAddToCart ? (added ? 'Added ✓' : 'Add to cart') : 'Add to cart disabled';

  return (
    <div className="yaw-buy">
      {tiers.length > 1 && (
        <div className="yaw-tabs" role="tablist" aria-label="Package type">
          {tiers.map((key) => (
            <button key={key} type="button" role="tab" aria-selected={key === tier} className="yaw-tab" onClick={() => { setTierKey(key); setSelected(null); }}>{tabLabel(key)}</button>
          ))}
        </div>
      )}
      {service.banner && <p className="yaw-banner"><strong>Information:</strong> {service.banner}</p>}
      <div className="yaw-packages" role="radiogroup" aria-label={`${tabLabel(tier)} packages`}>
        {packages.map((p, i) => {
          const on = selected === i;
          const hasPrice = isPriced(p);
          return (
            <button key={`${qty(p)}-${i}`} type="button" role="radio" aria-checked={on} className={`yaw-pkg${on ? ' is-on' : ''}`} onClick={() => setSelected(i)}>
              <span className="yaw-pkg-qty">{qty(p)}</span>
              <span className="yaw-pkg-unit">{service.unitLabel}</span>
              <span className="yaw-pkg-price">
                {hasPrice && p.originalPrice && <s>{money(p.originalPrice)}</s>}
                <b>{hasPrice ? money(p.price) : p.price}</b>
              </span>
              {hasPrice && p.discount && <span className="yaw-pkg-save">Save {p.discount}</span>}
            </button>
          );
        })}
      </div>
      <div className="yaw-actions-row" ref={actionsRef}>
        <button type="button" className="yaw-btn yaw-btn--red" disabled={!pkg || !canBuy} onClick={buyNow}>{buyLabel}</button>
        <button type="button" className="yaw-btn yaw-btn--dark" disabled={!pkg || !canAddToCart} onClick={addPackage}>{cartLabel}</button>
      </div>
      {!pkg && <p className="yaw-hint">Select a package to continue.</p>}
      <ul className="yaw-features">{service.features.map((f) => <li key={f}><Check />{f}</li>)}</ul>
      <div className={`yaw-buybar${pkg && barVisible ? ' is-on' : ''}`} aria-hidden={!(pkg && barVisible)}>
        <div className="yaw-buybar-info">
          <b>{pkg ? (isPriced(pkg) ? money(pkg.price) : 'Custom') : ''}</b>
          <span>{pkg ? `${qty(pkg)} ${service.unitLabel} · ${tabLabel(tier)}` : ''}</span>
        </div>
        {canAddToCart && <button type="button" className="yaw-icon-btn" aria-label="Add to cart" onClick={addPackage}><BagIcon /></button>}
        <button type="button" className="yaw-btn yaw-btn--red" disabled={!canBuy} onClick={buyNow}>{buyLabel}</button>
      </div>
    </div>
  );
}

/* ---------------- cart drawer (same cart as the rest of the site) ---------------- */
export function CartDrawer() {
  const { cartItems, removeFromCart, getCartTotal, isCartOpen, setIsCartOpen } = useCart();
  // the cart's texts are editable in Tina (global > cart), as they were in the original cart sidebar
  const cart = useGlobalContent()?.cart || {};
  const close = () => setIsCartOpen(false);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setIsCartOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setIsCartOpen]);
  useEffect(() => {
    document.documentElement.classList.toggle('yaw-locked', isCartOpen);
    return () => document.documentElement.classList.remove('yaw-locked');
  }, [isCartOpen]);
  return (
    <div className={`yaw-drawer${isCartOpen ? ' is-open' : ''}`} aria-hidden={!isCartOpen}>
      <div className="yaw-drawer-scrim" onClick={close} />
      <aside className="yaw-drawer-panel" role="dialog" aria-modal="true" aria-label="Your cart" data-lenis-prevent>
        <div className="yaw-sheet-grip" aria-hidden="true" />
        <header className="yaw-drawer-head"><h2>{cart.title || 'Your Cart'}</h2><button type="button" className="yaw-close" aria-label="Close cart" onClick={close}>×</button></header>
        {cartItems.length === 0 ? (
          <div className="yaw-drawer-empty">
            <p>{cart.emptyTitle || 'Your cart is empty'}</p>
            <p>{cart.emptySubtext || 'Add services to get started'}</p>
            <Link className="yaw-btn yaw-btn--dark" to="/" onClick={close}>{cart.browseServices || 'Browse Services'}</Link>
          </div>
        ) : (
          <>
            <ul className="yaw-lines">
              {cartItems.map((item) => (
                <li key={item.id} className="yaw-line">
                  <div>
                    <b>{item.serviceName || item.serviceType}</b>
                    {item.type && <span>Type: {item.type}</span>}
                    {item.quantity && <span>Quantity: {item.quantity}</span>}
                    {item.url && <span>URL: {item.url}</span>}
                  </div>
                  <div className="yaw-line-end">
                    <b>{money(item.price)}</b>
                    <button type="button" aria-label={`Remove ${item.serviceName || item.serviceType} from cart`} onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="yaw-drawer-foot">
              <div className="yaw-total"><span>Total:</span><b>{money(getCartTotal())}</b></div>
              <Link className="yaw-btn yaw-btn--red yaw-btn--block" to="/checkout" onClick={close}>Proceed to Checkout</Link>
              <Link className="yaw-link-btn" to="/" onClick={close} style={{ textAlign: 'center' }}>Continue Shopping</Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
