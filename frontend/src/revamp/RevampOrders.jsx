// My Orders on the imported revamp page: signed out, the page's own "Log in to see your orders" card stays;
// signed in, that card is swapped for the customer's real orders (same API and statuses as MyOrdersPage).
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchMyOrders, formatDate, paymentMethodLabel, statusInfo } from '../utils/orders';

const FILTERS = { 'All orders': 'all', 'Awaiting payment': 'pending', Processing: 'processing', Completed: 'completed' };

export default function RevampOrders({ emptyState }) {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const host = useMemo(() => {
    const el = document.createElement('div');
    el.className = 'yaw-orders';
    return el;
  }, []);

  // The list sits where the sign-in card was; the card and its Log in / Sign up buttons return when signed out
  useEffect(() => {
    const actions = (emptyState.closest('form') || emptyState.parentElement)?.querySelector('.yaw-actions');
    emptyState.after(host);
    const showCard = !isLoggedIn && !authLoading;
    emptyState.style.display = showCard ? '' : 'none';
    if (actions) actions.style.display = isLoggedIn ? 'none' : '';
    return () => { host.remove(); emptyState.style.display = ''; if (actions) actions.style.display = ''; };
  }, [emptyState, host, isLoggedIn, authLoading]);

  // The page's filter pills choose which orders show
  useEffect(() => {
    const form = emptyState.closest('form') || document;
    const radios = Array.from(form.querySelectorAll('input[type="radio"][name="filter"]'));
    const pick = (e) => setFilter(FILTERS[e.target.value] || 'all');
    radios.forEach((r) => r.addEventListener('change', pick));
    return () => radios.forEach((r) => r.removeEventListener('change', pick));
  }, [emptyState]);

  useEffect(() => {
    if (authLoading) return undefined;
    if (!isLoggedIn) { setLoading(false); return undefined; }
    let cancelled = false;
    setLoading(true);
    fetchMyOrders()
      .then((data) => !cancelled && setOrders(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [isLoggedIn, authLoading]);

  if (!isLoggedIn) return null;
  const shown = orders.filter((order) => filter === 'all' || statusInfo(order.status).key === filter);
  let content;
  if (loading || authLoading) {
    content = <p className="clone-form-status" role="status">Loading your orders…</p>;
  } else if (error) {
    content = <div className="yaw-empty"><h3>Something went wrong</h3><p>{error}</p></div>;
  } else if (shown.length === 0) {
    content = (
      <div className="yaw-empty">
        <h3>No orders found</h3>
        <p>{filter === 'all' ? "You haven't placed any orders yet." : `You don't have any ${filter} orders.`}</p>
        <p><Link className="yaw-btn yaw-btn--red" to="/">Browse services</Link></p>
      </div>
    );
  } else {
    content = (
      <ul className="yaw-order-list">
        {shown.map((order) => {
          const status = statusInfo(order.status);
          const first = order.items[0];
          return (
            <li key={order.id} className={`yaw-order is-${status.key}`}>
              <div className="yaw-order-head">
                <div>
                  <span className="yaw-order-id">Order #{order.id}</span>
                  <b>{first?.service || 'Order'}{order.items.length > 1 && ` and ${order.items.length - 1} more`}</b>
                  <span>Placed on {formatDate(order.createdAt)}</span>
                </div>
                <div className="yaw-order-total"><b>${order.total.toFixed(2)}</b><span className="yaw-order-chip">{status.label}</span></div>
              </div>
              <ul className="yaw-lines">
                {order.items.map((item) => (
                  <li key={item.id} className="yaw-line">
                    <div><b>{item.service}</b><span>{item.platform}, {item.quantity}</span></div>
                    <div className="yaw-line-end"><b>${item.price.toFixed(2)}</b></div>
                  </li>
                ))}
              </ul>
              <div className="yaw-order-foot"><span>Paid by {paymentMethodLabel(order.paymentMethod)}</span><Link to={`/orders/${order.id}`}>View details</Link></div>
            </li>
          );
        })}
      </ul>
    );
  }
  return createPortal(content, host);
}
