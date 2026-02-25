import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Check, CreditCard, Coins, Mail, MapPin, Copy, CheckCheck, ShieldCheck, Star, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCtaActions } from '../contexts/CtaActionsContext';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import PaymentLoadingOverlay from '../components/PaymentLoadingOverlay';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function SharedPaymentPage() {
    const [searchParams] = useSearchParams();
    const { user: currentUser } = useAuth();
    const { isEnabled } = useCtaActions();

    const [isProcessing, setIsProcessing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isExpired, setIsExpired] = useState(false);

    // Read package details from URL query params
    const amount = parseInt(searchParams.get('amount') || '500', 10);
    const price = parseFloat(searchParams.get('price') || '45');
    const originalPrice = parseFloat(searchParams.get('original') || (price * 1.5).toFixed(2));
    const platform = searchParams.get('platform') || 'YouTube';
    const service = searchParams.get('service') || 'Views';
    const label = searchParams.get('label') || '';
    const tsParam = searchParams.get('ts');

    useEffect(() => {
        if (!tsParam) {
            setIsExpired(false);
            return;
        }
        const createdAt = Number(tsParam);
        if (!createdAt || Number.isNaN(createdAt)) {
            setIsExpired(false);
            return;
        }
        const now = Date.now();
        const diff = now - createdAt;
        // Link expires in 24 hours for flexibility
        setIsExpired(diff > 24 * 60 * 60 * 1000);
    }, [tsParam]);

    // Contact fields (required to place the order)
    const [email, setEmail] = useState('');
    const [targetUrl, setTargetUrl] = useState(searchParams.get('username') || '');
    const [emailError, setEmailError] = useState('');
    const [urlError, setUrlError] = useState('');

    useEffect(() => {
        if (currentUser?.email) setEmail(currentUser.email);
    }, [currentUser]);

    /* ── Place Order ── */
    const validate = () => {
        let ok = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setEmailError('Please enter a valid email address');
            ok = false;
        } else {
            setEmailError('');
        }
        if (!targetUrl || targetUrl.trim().length < 2) {
            setUrlError(`Please enter your ${platform} link or username`);
            ok = false;
        } else {
            setUrlError('');
        }
        return ok;
    };

    const handlePay = async (method) => {
        if (isExpired) {
            alert('This payment link has expired. Please ask the sender to generate a new link.');
            return;
        }

        if (!validate()) return;

        if (!isEnabled('buy')) {
            alert('Checkout is temporarily unavailable. Please try again later.');
            return;
        }

        setIsProcessing(true);

        try {
            const items = [{
                platform,
                service,
                amount,
                price,
                username: targetUrl,
            }];

            const response = await fetch(`${API_BASE}/api/orders/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser ? currentUser.id : null,
                    email,
                    usernames: { [platform]: targetUrl },
                    items,
                    paymentMethod: method,
                }),
            });

            const data = await response.json();
            if (response.ok && data.paymentUrl) {
                window.location.href = data.paymentUrl;
                return;
            }

            alert(data.error || 'Failed to create order');
        } catch (err) {
            console.error('Order Error:', err);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <Layout>
            <SEO
                title={label || `Pay for ${amount} ${platform} ${service}`}
                description="Secure payment link to complete your order."
            />
            <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumb */}
                    <Link to="/" className="inline-flex items-center text-brand-red font-bold mb-4 sm:mb-6 hover:underline text-sm">
                        ← Back to Home
                    </Link>

                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                        {/* Header Strip */}
                        <div className="bg-brand-red px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={14} className="sm:w-4 sm:h-4" />
                                <span>Secure SSL Encrypted</span>
                            </div>
                            <div className="hidden sm:flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="white" />)}
                                    <span className="ml-1">4.9/5</span>
                                </div>
                                <span>100k+ Satisfied Customers</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2">
                            {/* Left: Summary */}
                            <div className="p-5 sm:p-8 md:border-r border-b md:border-b-0 border-gray-100 bg-gray-50/50">
                                {label && (
                                    <span className="inline-block bg-brand-red/10 text-brand-red text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 sm:mb-4">
                                        {label}
                                    </span>
                                )}
                                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
                                    {amount.toLocaleString()} {platform} {service}
                                </h1>
                                <p className="text-sm sm:text-base text-gray-500 font-medium mb-6 sm:mb-8">
                                    Custom order link generated for you. Complete payment to start delivery.
                                </p>

                                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                    <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
                                        <span className="text-sm sm:text-base text-gray-600 font-bold">Original Price</span>
                                        <span className="text-sm sm:text-base text-gray-400 line-through font-bold">${originalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 sm:py-3">
                                        <span className="text-lg sm:text-xl font-black text-gray-900">Total Price</span>
                                        <span className="text-2xl sm:text-3xl font-black text-brand-red">${price.toFixed(2)}</span>
                                    </div>
                                    <div className="bg-green-50 text-green-700 px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold text-center">
                                        You save ${(originalPrice - price).toFixed(2)} with this special link!
                                    </div>
                                </div>

                                {/* Share Link Strip */}
                                <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center gap-3">
                                    <Zap size={16} className="text-brand-red flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Share this link</p>
                                        <p className="text-[11px] sm:text-xs text-gray-600 font-medium truncate">{window.location.href}</p>
                                    </div>
                                    <button
                                        onClick={handleCopyLink}
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
                                    {/* Email */}
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address *</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                                                placeholder="your@email.com"
                                                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all outline-none text-sm sm:text-base ${emailError ? 'border-red-500' : 'border-gray-100 focus:border-brand-red'}`}
                                            />
                                        </div>
                                        {emailError && <p className="text-[10px] text-red-500 font-bold mt-1">{emailError}</p>}
                                    </div>

                                    {/* Target Link */}
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{platform} Link/Username *</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                value={targetUrl}
                                                onChange={(e) => { setTargetUrl(e.target.value); setUrlError(''); }}
                                                placeholder={`Paste your ${platform} link here`}
                                                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all outline-none text-sm sm:text-base ${urlError ? 'border-red-500' : 'border-gray-100 focus:border-brand-red'}`}
                                            />
                                        </div>
                                        {urlError && <p className="text-[10px] text-red-500 font-bold mt-1">{urlError}</p>}
                                    </div>

                                    {/* Payment Buttons */}
                                    <div className="pt-2 sm:pt-4 space-y-3">
                                        {price >= 35 && (
                                            <button
                                                onClick={() => handlePay('card')}
                                                disabled={isProcessing || isExpired}
                                                className="w-full bg-brand-red hover:bg-[#C62828] text-white font-black py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-200 text-sm sm:text-base"
                                            >
                                                <CreditCard size={18} />
                                                {isProcessing ? 'Processing...' : 'Pay with Card'}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handlePay('crypto')}
                                            disabled={isProcessing || isExpired}
                                            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-200 text-sm sm:text-base"
                                        >
                                            <Coins size={18} />
                                            {isProcessing ? 'Processing...' : 'Pay with Crypto'}
                                        </button>
                                    </div>

                                    {isExpired && (
                                        <p className="text-xs text-red-500 font-bold text-center">
                                            This link has expired. Please ask the sender to generate a new one.
                                        </p>
                                    )}

                                    <p className="text-[10px] text-gray-400 text-center font-bold">
                                        Instant Confirmation • 24/7 Support • 100% Safe Payments
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PaymentLoadingOverlay isOpen={isProcessing} />
        </Layout>
    );
}
