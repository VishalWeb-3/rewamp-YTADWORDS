import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import PageHead from '../components/site/PageHead';
import Pass from '../components/site/Pass';
import { Arrow } from '../components/landing/icons';
import { useCart } from '../contexts/CartContext';

const API_BASE = import.meta.env.VITE_API_URL || '';
const POLL_MS = 3000;
const MAX_POLLS = 20; // about one minute

/* Confetti in the pass foil colours, falling once the payment is confirmed */
const COLORS = ['#7ee8fa', '#b7a4ff', '#ffcdf0', '#c6f5a8', '#e53935', '#0b1020'];

function Confetti() {
  const [pieces] = useState(() => Array.from({ length: 60 }, (_, i) => {
    const size = Math.random() * 9 + 6;
    return {
      id: i,
      style: {
        left: `${Math.random() * 100}vw`,
        width: Math.random() > 0.6 ? `${size * 2}px` : `${size}px`,
        height: `${size}px`,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        background: COLORS[i % COLORS.length],
        animationDuration: `${2.8 + Math.random() * 1.8}s`,
        animationDelay: `${0.9 + Math.random() * 1.2}s`,
      },
    };
  }));
  return pieces.map((p) => <i key={p.id} className="pg-confetti" style={p.style} aria-hidden="true" />);
}

/* ─── Main ─── */
export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order') || searchParams.get('orderId') || searchParams.get('order_id');
  const { clearCart } = useCart();
  // checking → PAID | PENDING | CANCELED; "unknown" when there is no order reference to check
  const [status, setStatus] = useState(orderId ? 'checking' : 'unknown');
  const [showConfetti, setShowConfetti] = useState(false);

  // Confirm the payment with the server instead of trusting the redirect
  useEffect(() => {
    if (!orderId) return;
    let polls = 0;
    let timer;
    let cancelled = false;
    const check = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/orders/status/${encodeURIComponent(orderId)}`);
        const data = res.ok ? await res.json() : null;
        if (cancelled) return;
        const next = data?.status || 'unknown';
        setStatus(next);
        if (next === 'PENDING' && ++polls < MAX_POLLS) timer = setTimeout(check, POLL_MS);
      } catch {
        if (!cancelled && ++polls < MAX_POLLS) timer = setTimeout(check, POLL_MS);
      }
    };
    check();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [orderId]);

  // Once paid: celebrate, and empty the cart if this checkout came from it
  useEffect(() => {
    if (status !== 'PAID') return;
    try {
      const pending = JSON.parse(sessionStorage.getItem('pendingCheckout') || 'null');
      if (pending?.externalOrderId === orderId) {
        if (pending.fromCart) clearCart();
        sessionStorage.removeItem('pendingCheckout');
      }
    } catch {
      /* ignore malformed storage */
    }
    setShowConfetti(true);
    const t = setTimeout(() => setShowConfetti(false), 5500);
    return () => clearTimeout(t);
    // Run once when the status flips to PAID; `clearCart` changes identity and would replay the confetti
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const isPaid = status === 'PAID';
  const heading = isPaid
    ? 'Payment received. Your order is in.'
    : status === 'CANCELED'
      ? 'Payment not completed'
      : status === 'unknown'
        ? 'Thanks for your order'
        : 'Confirming your payment…';
  const message = isPaid
    ? "Your payment was successful and your order is now being processed. We'll get started right away!"
    : status === 'CANCELED'
      ? 'The payment provider reported that this payment failed or was cancelled. You have not been charged for this order.'
      : status === 'unknown'
        ? 'We could not find this order yet. If you completed a payment, it will show in My Orders once confirmed.'
        : 'We are waiting for the payment provider to confirm your payment. This usually takes less than a minute; crypto payments can take longer. You can safely close this page.';

  const shortId = orderId ? orderId.replace(/^(ORDER|LINK)_/, '').slice(0, 8).toUpperCase() : null;
  const passState = isPaid
    ? { tone: 'dark', stamp: 'PAID', title: 'Order confirmed', label: 'Paid' }
    : status === 'CANCELED'
      ? { tone: 'void', stamp: 'VOID', title: 'Not completed', label: 'Not charged' }
      : status === 'unknown'
        ? { tone: 'light', title: 'Order received', label: 'Waiting for confirmation' }
        : { tone: 'light', title: 'Confirming', label: 'Checking with the provider' };

  return (
    <Layout>
      <SEO
        title="Order Status | YoutubeADwords"
        description="Check the payment status of your YoutubeADwords order."
      />

      {showConfetti && <Confetti />}

      <div className="pg-status pg-wrap">
        <div>
          <p className="sr-only" role="status">{heading}</p>
          <PageHead title={heading} lede={message}>
            <div className="pg-actions">
              <Link to="/orders" className="lp-btn lp-btn-red">View my orders<Arrow /></Link>
              <Link to="/" className="lp-btn lp-btn-line">Back to home</Link>
            </div>
          </PageHead>

          {status !== 'CANCELED' && (
            <ol className="lp-steps pg-next pg-in" style={{ '--d': '0.8s' }}>
              <li>
                <span className="num lp-mono" aria-hidden="true">01</span>
                <h3 className="lp-display">Processing</h3>
                <p>Our system picks up your order and queues delivery straight away.</p>
              </li>
              <li>
                <span className="num lp-mono" aria-hidden="true">02</span>
                <h3 className="lp-display">Delivery begins</h3>
                <p>Views, subscribers or traffic start appearing within minutes to hours.</p>
              </li>
              <li>
                <span className="num lp-mono" aria-hidden="true">03</span>
                <h3 className="lp-display">Track it</h3>
                <p>Follow delivery in My Orders. Guest buyers can sign up with the same email to see it.</p>
              </li>
            </ol>
          )}

          <p className="pg-help pg-in" style={{ '--d': '1s' }}>
            Questions? Email <a href="mailto:support@youtubeadwords.com">support@youtubeadwords.com</a>
          </p>
        </div>

        <div className={`pg-status-pass${status === 'checking' || status === 'PENDING' ? ' is-checking' : ''}`} aria-hidden="true">
          <Pass
            kind="Order pass"
            serial={shortId ? `#${shortId}` : 'YAW'}
            tone={passState.tone}
            strap={isPaid ? 'var(--green)' : undefined}
            title={passState.title}
            rows={[
              { label: 'Payment', value: passState.label },
              { label: 'Order', value: shortId ? `#${shortId}` : 'Not found yet', mono: true },
            ]}
            stamp={passState.stamp}
          />
        </div>
      </div>
    </Layout>
  );
}
