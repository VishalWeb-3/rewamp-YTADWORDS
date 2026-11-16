import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CreditCard, Coins, Mail, MapPin, Copy, CheckCheck, ShieldCheck, Star, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCtaActions } from '../contexts/CtaActionsContext';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import PaymentLoadingOverlay from '../components/PaymentLoadingOverlay';
import { isValidLink } from '../utils/linkValidator';
import { isValidEmail } from '../utils/emailValidator';
import { triggerPaymentRelay } from '../utils/paymentRelay';
import { decodeShareItems, readJson } from '../utils/orderItems';
import { formatQuantity } from '../utils/quantity';

const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Shared payment link. The URL only names packages; prices always come from the server,
 * so editing the link cannot change what is charged.
 */
export default function SharedPaymentPage() {
    const [searchParams] = useSearchParams();
    const { user: currentUser } = useAuth();
    const { isEnabled } = useCtaActions();

    const items = useMemo(() => decodeShareItems(searchParams.get('items')), [searchParams]);

    const [quote, setQuote] = useState(null);
    const [loadError, setLoadError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [payError, setPayError] = useState(null);

    const [email, setEmail] = useState(searchParams.get('email') || '');
    const [links, setLinks] = useState(() => (items.length === 1 && searchParams.get('username') ? { 0: searchParams.get('username') } : {}));
    const [emailError, setEmailError] = useState('');
    const [urlError, setUrlError] = useState('');

    useEffect(() => {
        if (currentUser?.email && !searchParams.get('email')) {
            setEmail(currentUser.email);
        }
    }, [currentUser, searchParams]);

    useEffect(() => {
        if (items.length === 0) {
            setLoadError('This payment link is incomplete. Please ask the sender for a new link.');
            return;
        }
        let cancelled = false;
        fetch(`${API_BASE}/api/orders/quote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
        })
            .then(async (res) => ({ ok: res.ok, data: await readJson(res) }))
            .then(({ ok, data }) => {
                if (cancelled) return;
                if (ok) setQuote(data);
                else setLoadError(`${data.error || 'This payment link is no longer valid'}. Please ask the sender for a new link.`);
            })
            .catch((err) => !cancelled && setLoadError(err.message || 'Could not load this payment link.'));
        return () => {
            cancelled = true;
        };
    }, [items]);

    const total = quote?.totalAmount ?? 0;
    const title = quote ? quote.items.map((i) => i.service).join(' + ') : 'Secure Payment Link';

    /* ── Place Order ── */
    const validate = () => {
        let ok = true;
        if (!isValidEmail(email)) {
            setEmailError('Please enter a valid email address.');
            ok = false;
        } else {
            setEmailError('');
        }
        const badIndex = (quote?.items || []).findIndex((item, i) => !isValidLink(links[i], item.platform));
        if (badIndex !== -1) {
            setUrlError(`Please enter a valid ${quote.items[badIndex].platform} link or username for "${quote.items[badIndex].service}".`);
            ok = false;
        } else {
            setUrlError('');
        }
        return ok;
    };

    const handlePay = async (method) => {
        setPayError(null);
        if (!validate()) return;

        if (!isEnabled('buy')) {
            setPayError({ message: 'Checkout is temporarily unavailable. Please try again later.' });
            return;
        }

        setIsProcessing(true);
        let isRedirecting = false;

        try {
            const response = await fetch(`${API_BASE}/api/orders/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    items: items.map((item, i) => ({ ...item, link: links[i] })),
                    paymentMethod: method,
                }),
            });
            const data = await readJson(response);

            if (response.ok && data.paymentUrl) {
                sessionStorage.setItem('pendingCheckout', JSON.stringify({ externalOrderId: data.externalOrderId, fromCart: false }));
                isRedirecting = true;
                if (method === 'card') {
                    triggerPaymentRelay(data.paymentUrl);
                } else {
                    window.location.href = data.paymentUrl;
                }
                return;
            }

            setPayError({
                message: data.details || data.error || `Failed to create order (${response.status})`,
                needsLogin: response.status === 409,
            });
        } catch (err) {
            console.error('Order Error:', err);
            setPayError({ message: err.message || 'Something went wrong. Please try again.' });
        } finally {
            if (!isRedirecting) {
                setIsProcessing(false);
            }
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            /* clipboard blocked: the link is visible next to the button */
        }
    };

    return (
        <Layout>
            <SEO title={`Pay for ${title} | YoutubeADwords`} description="Secure payment link to complete your order." />
            <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 pg-flow">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumb */}
                    <Link to="/" className="inline-flex items-center text-brand-red font-bold mb-4 sm:mb-6 hover:underline text-sm">
                        ← Back to Home
                    </Link>

                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                        {/* Header Strip */}
                        <div className="bg-brand-red px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={14} className="sm:w-4 sm:h-4" aria-hidden="true" />
                                <span>Secure SSL Encrypted</span>
                            </div>
                            <div className="hidden sm:flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="white" aria-hidden="true" />)}
                                    <span className="ml-1">4.9/5</span>
                                </div>
                                <span>100k+ Satisfied Customers</span>
                            </div>
                        </div>

                        {loadError ? (
                            <div role="alert" className="p-8 text-center">
                                <h1 className="text-2xl font-black text-gray-900 mb-2">Payment link unavailable</h1>
                                <p className="text-gray-600">{loadError}</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2">
                                {/* Left: Summary */}
                                <div className="p-5 sm:p-8 md:border-r border-b md:border-b-0 border-gray-100 bg-gray-50/50">
                                    <span className="inline-block bg-brand-red/10 text-brand-red text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 sm:mb-4">
                                        Shared Order
                                    </span>
                                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
                                        {quote ? title : 'Loading your order…'}
                                    </h1>
                                    <p className="text-sm sm:text-base text-gray-500 font-medium mb-6 sm:mb-8">
                                        Custom order link generated for you. Complete payment to start delivery.
                                    </p>

                                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                        {(quote?.items || []).map((item, i) => (
                                            <div key={i} className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
                                                <span className="text-sm sm:text-base text-gray-600 font-bold">
                                                    {formatQuantity(item.amount)} {item.platform}
                                                </span>
                                                <span className="text-sm sm:text-base text-gray-700 font-bold">${item.price.toFixed(2)}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center py-2 sm:py-3">
                                            <span className="text-lg sm:text-xl font-black text-gray-900">Total Price</span>
                                            <span className="text-2xl sm:text-3xl font-black text-brand-red">${total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Share Link Strip */}
                                    <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center gap-3">
                                        <Zap size={16} className="text-brand-red flex-shrink-0 sm:w-[18px] sm:h-[18px]" aria-hidden="true" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Share this link</p>
                                            <p className="text-[11px] sm:text-xs text-gray-600 font-medium truncate">{window.location.href}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleCopyLink}
                                            aria-label={copied ? 'Link copied' : 'Copy payment link'}
                                            className={`p-2 rounded-lg transition-colors flex-shrink-0 ${copied ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        >
                                            {copied ? <CheckCheck size={16} /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Right: Checkout Form */}
                                <div className="p-5 sm:p-8">
                                    <h2 className="text-lg font-black text-gray-900 mb-5 sm:mb-6">Complete Checkout</h2>

                                    <div className="space-y-5 sm:space-y-6">
                                        {payError && (
                                            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                                {payError.message}
                                                {payError.needsLogin && (
                                                    <>
                                                        {' '}
                                                        <Link to="/login" className="font-bold underline">Log in</Link>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {/* Email */}
                                        <div>
                                            <label htmlFor="shared-email" className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address *</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
                                                <input
                                                    id="shared-email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                                                    placeholder="your@email.com"
                                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all outline-none text-sm sm:text-base ${emailError ? 'border-red-500' : 'border-gray-100 focus:border-brand-red'}`}
                                                />
                                            </div>
                                            {emailError && <p className="text-[10px] text-red-500 font-bold mt-1">{emailError}</p>}
                                        </div>

                                        {/* Target links, one per item */}
                                        {(quote?.items || []).map((item, i) => {
                                            const value = links[i] || '';
                                            const invalid = value && !isValidLink(value, item.platform);
                                            return (
                                                <div key={i}>
                                                    <label htmlFor={`shared-link-${i}`} className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                                                        {quote.items.length > 1 ? `${item.service}: ` : ''}{item.platform} Link/Username *
                                                    </label>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
                                                        <input
                                                            id={`shared-link-${i}`}
                                                            type="text"
                                                            value={value}
                                                            onChange={(e) => { setLinks({ ...links, [i]: e.target.value }); setUrlError(''); }}
                                                            placeholder={`Paste your ${item.platform} link here`}
                                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all outline-none text-sm sm:text-base ${invalid ? 'border-red-500' : 'border-gray-100 focus:border-brand-red'}`}
                                                        />
                                                    </div>
                                                    {invalid && <p className="text-[10px] text-red-500 font-bold mt-1">Please enter a valid {item.platform} link</p>}
                                                </div>
                                            );
                                        })}
                                        {urlError && <p className="text-[10px] text-red-500 font-bold">{urlError}</p>}

                                        {/* Payment Buttons */}
                                        <div className="pt-2 sm:pt-4 space-y-3">
                                            {quote?.cardAvailable && (
                                                <button
                                                    type="button"
                                                    onClick={() => handlePay('card')}
                                                    disabled={isProcessing}
                                                    className="w-full bg-brand-red hover:bg-[#C62828] text-white font-black py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-200 text-sm sm:text-base"
                                                >
                                                    <CreditCard size={18} aria-hidden="true" />
                                                    {isProcessing ? 'Processing...' : 'Pay with Card'}
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handlePay('crypto')}
                                                disabled={isProcessing || !quote}
                                                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-200 text-sm sm:text-base"
                                            >
                                                <Coins size={18} aria-hidden="true" />
                                                {isProcessing ? 'Processing...' : 'Pay with Crypto'}
                                            </button>
                                        </div>

                                        <p className="text-[10px] text-gray-400 text-center font-bold">
                                            Instant Confirmation • 24/7 Support • 100% Safe Payments
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <PaymentLoadingOverlay isOpen={isProcessing} />
        </Layout>
    );
}
