import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import PageHead from '../components/site/PageHead';
import { Arrow } from '../components/landing/icons';

// how far along the delivery bar sits for each status
const PROGRESS = { pending: 8, processing: 55, completed: 100, cancelled: 0 };
import { useAuth } from '../contexts/AuthContext';
import { fetchMyOrders, formatDate, paymentMethodLabel, statusInfo } from '../utils/orders';

export default function MyOrdersPage() {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchMyOrders()
      .then((data) => !cancelled && setOrders(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, authLoading]);

  const filteredOrders = orders.filter((order) => filter === 'all' || statusInfo(order.status).key === filter);

  const renderEmpty = (title, message, cta) => (
    <div className="pg-empty pg-in">
      <span className="pg-empty-slot" aria-hidden="true" />
      <h2 className="lp-display">{title}</h2>
      <p>{message}</p>
      {cta}
    </div>
  );

  let content;
  if (loading || authLoading) {
    content = <p className="text-gray-600" role="status">Loading your orders…</p>;
  } else if (!isLoggedIn) {
    content = renderEmpty(
      'Log in to see your orders',
      'Orders placed as a guest appear here once you sign up with the same email address.',
      <div className="pg-actions" style={{ justifyContent: 'center' }}>
        <Link to="/login" className="lp-btn lp-btn-red">Log in<Arrow /></Link>
        <Link to="/signup" className="lp-btn lp-btn-line">Sign up</Link>
      </div>
    );
  } else if (error) {
    content = renderEmpty('Something went wrong', error, null);
  } else if (filteredOrders.length === 0) {
    content = renderEmpty(
      'No orders found',
      filter === 'all' ? "You haven't placed any orders yet." : `You don't have any ${filter} orders.`,
      <Link to="/" className="lp-btn lp-btn-red">Browse services<Arrow /></Link>
    );
  } else {
    content = (
      <div className="pg-orders">
        {filteredOrders.map((order, idx) => {
          const status = statusInfo(order.status);
          const first = order.items[0];
          return (
            <article key={order.id} className="pg-order lp-reveal" style={{ '--i': Math.min(idx, 4) }}>
              <div className="pg-order-head">
                <div>
                  <p className="pg-order-id lp-mono">Order #{order.id}</p>
                  <h3 className="lp-display">
                    {first?.service || 'Order'}
                    {order.items.length > 1 && <span> and {order.items.length - 1} more</span>}
                  </h3>
                  <p className="pg-order-meta">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className="pg-order-total">
                  <b>${order.total.toFixed(2)}</b>
                  <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                </div>
              </div>

              <div className={`pg-track is-${status.key}`}>
                <span className="pg-chip">{status.label}</span>
                <div className="lp-bar" aria-hidden="true"><i style={{ '--p': `${PROGRESS[status.key] ?? 0}%` }} /></div>
              </div>

              <ul className="pg-order-items">
                {order.items.map((item) => (
                  <li key={item.id}>
                    <div>
                      <b>{item.service}</b>
                      <span>{item.platform}, {item.quantity}</span>
                    </div>
                    <span className="lp-mono">${item.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              <div className="pg-order-foot">
                <p>Paid by {paymentMethodLabel(order.paymentMethod)}</p>
                <Link to={`/orders/${order.id}`}>View details<Arrow size={16} /></Link>
              </div>
            </article>
          );
        })}
      </div>
    );
  }

  return (
    <Layout>
      <SEO title="My Orders | YoutubeADwords" description="Track the status of your YoutubeADwords orders." />
      <div className="pg-wrap pg-section">
        <div className="pg-orders-top">
          <PageHead title="My Orders" lede="Every order you place, and how far its delivery has got." size="md" />
          <Link to="/" className="lp-btn lp-btn-line pg-in" style={{ '--d': '0.5s' }}>Browse services</Link>
        </div>

        {/* Filter Tabs */}
        <div className="pg-tabs pg-in" style={{ '--d': '0.55s' }} role="tablist">
          {[
            { id: 'all', label: 'All orders' },
            { id: 'pending', label: 'Awaiting payment' },
            { id: 'processing', label: 'Processing' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => setFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {content}
      </div>
    </Layout>
  );
}
