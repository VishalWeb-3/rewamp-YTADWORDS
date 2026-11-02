import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import Pass from '../components/site/Pass';
import { Arrow } from '../components/landing/icons';
import { useAuth } from '../contexts/AuthContext';
import { fetchMyOrders, formatDate, paymentMethodLabel, statusInfo } from '../utils/orders';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [state, setState] = useState('loading'); // loading | ready | missing | error

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      setState('missing');
      return;
    }
    let cancelled = false;
    fetchMyOrders()
      .then((orders) => {
        if (cancelled) return;
        const match = orders.find((o) => o.items.some((item) => String(item.id) === String(id)));
        setOrder(match || null);
        setState(match ? 'ready' : 'missing');
      })
      .catch(() => !cancelled && setState('error'));
    return () => {
      cancelled = true;
    };
  }, [id, isLoggedIn, authLoading]);

  if (state === 'loading') {
    return (
      <Layout>
        <SEO title="Order Details | YoutubeADwords" description="Order details" />
        <p className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-600" role="status">
          Loading order…
        </p>
      </Layout>
    );
  }

  if (state !== 'ready') {
    return (
      <Layout>
        <SEO title="Order Not Found | YoutubeADwords" description="Order details" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {state === 'error' ? 'Could not load this order' : 'Order Not Found'}
          </h1>
          <p className="text-gray-600 mb-8">
            {!isLoggedIn
              ? 'Log in to see your orders.'
              : state === 'error'
                ? 'Please try again in a moment.'
                : "The order you're looking for doesn't exist."}
          </p>
          <Link
            to={isLoggedIn ? '/orders' : '/login'}
            className="px-6 py-3 bg-brand-red text-white font-semibold rounded-lg hover:bg-[#C62828] transition-colors"
          >
            {isLoggedIn ? 'View All Orders' : 'Log in'}
          </Link>
        </div>
      </Layout>
    );
  }

  const status = statusInfo(order.status);

  return (
    <Layout>
      <SEO title={`Order #${order.id} | YoutubeADwords`} description="Order details" />
      <div className="pg-wrap pg-section">
        <button type="button" onClick={() => navigate('/orders')} className="pg-back pg-in" style={{ '--d': '0s' }}>
          <span aria-hidden="true">&larr;</span> Back to orders
        </button>

        <div className="pg-receipt">
          <div>
            <header className="pg-head pg-head-md">
              <h1 className="lp-display pg-in" style={{ '--d': '0.05s' }}>Order #{order.id}</h1>
              <p className="pg-lede">Placed on {formatDate(order.createdAt)}</p>
            </header>

            <div className={`pg-track is-${status.key} pg-in`} style={{ '--d': '0.3s' }}>
              <span className="pg-chip">{status.label}</span>
            </div>

            <h2 className="pg-sub lp-display pg-in" style={{ '--d': '0.35s' }}>Items</h2>
            <ul className="pg-order-items pg-receipt-items pg-in" style={{ '--d': '0.4s' }}>
              {order.items.map((item) => (
                <li key={item.id}>
                  <div style={{ minWidth: 0 }}>
                    <b>{item.service}</b>
                    <span>Quantity {item.quantity}</span>
                    {item.link && <span className="pg-link-line">{item.link}</span>}
                  </div>
                  <span className="lp-mono">${item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <dl className="pg-facts pg-in" style={{ '--d': '0.5s', maxWidth: 'none' }}>
              <div><dt>Payment method</dt><dd>{paymentMethodLabel(order.paymentMethod)}</dd></div>
              <div className="pg-total"><dt>Total</dt><dd>${order.total.toFixed(2)}</dd></div>
            </dl>

            <div className="pg-actions pg-in" style={{ '--d': '0.6s', marginTop: '2rem' }}>
              <Link to="/" className="lp-btn lp-btn-red">Continue shopping<Arrow /></Link>
              <Link to="/contact" className="lp-btn lp-btn-line">Ask about this order</Link>
            </div>
          </div>

          <aside className="pg-receipt-pass" aria-hidden="true">
            <Pass
              kind="Order pass"
              serial={`#${order.id}`}
              tone="dark"
              strap="var(--red)"
              title={`$${order.total.toFixed(2)}`}
              rows={[
                { label: 'Status', value: status.label },
                { label: 'Items', value: String(order.items.length) },
                { label: 'Placed', value: formatDate(order.createdAt) },
              ]}
            />
          </aside>
        </div>
      </div>
    </Layout>
  );
}
