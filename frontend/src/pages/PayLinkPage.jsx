import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Coins, CreditCard, Loader2, ShieldCheck, AlertCircle, Mail } from 'lucide-react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import PaymentLoadingOverlay from '../components/PaymentLoadingOverlay';
import { isValidEmail } from '../utils/emailValidator';
import { triggerPaymentRelay } from '../utils/paymentRelay';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function PayLinkPage() {
    const { token } = useParams();
    const [link, setLink] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [payError, setPayError] = useState('');

    const fetchLink = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/api/payment-links/${token}`);
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                const msg =
                    err.error ||
                    (res.status === 410
                        ? 'This payment link has expired.'
                        : 'This payment link is not available.');
                setError(msg);
                setLink(null);
            } else {
                const data = await res.json();
                setLink(data);
                if (data.customerEmail) {
                    setEmail(data.customerEmail);
                }
            }
        } catch (e) {
            console.error(e);
            setError('Unable to load payment link. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchLink();
    }, [fetchLink]);

    const validate = () => {
        const value = email || link?.customerEmail || '';
        if (!value) {
            setEmailError('Please enter your email address');
            return false;
        }
        if (!isValidEmail(value)) {
            setEmailError('Please enter a valid email address.');
            return false;
        }
        setEmailError('');
        return true;
    };

    const handlePay = async (method) => {
        if (!link) return;
        if (!validate()) return;

        setPayError('');
        setIsProcessing(true);
        let isRedirecting = false;
        try {
            const res = await fetch(`${API_BASE}/api/payment-links/${token}/pay`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentMethod: method,
                    email: email || link.customerEmail,
                }),
            });

            const text = await res.text();
            let data = {};
            try {
                data = JSON.parse(text);
            } catch {
                console.error('Non-JSON response:', text);
                const snippet = text.length > 100 ? text.slice(0, 100) + '...' : text;
                throw new Error(`Server error. ${snippet.includes('<!DOCTYPE') ? 'Check backend or URL.' : 'Details: ' + snippet}`);
            }

            if (!res.ok) {
                throw new Error(data.details || data.error || `Failed to initiate payment (${res.status})`);
            }

            if (data.paymentUrl) {
                isRedirecting = true;
                if (method === 'card') {
                    triggerPaymentRelay(data.paymentUrl);
                } else {
                    window.location.href = data.paymentUrl;
                }
                return;
            }
            throw new Error('Missing payment URL from gateway');
        } catch (e) {
            console.error(e);
            setPayError(e.message || 'Failed to start payment. Please try again.');
        } finally {
            if (!isRedirecting) {
                setIsProcessing(false);
            }
        }
    };

    const showCard = link ? (link.amount >= 35 && link.amount <= 999) : true;

    return (
        <Layout>
            <SEO
                title={link ? `Pay ${link.amount.toFixed(2)} ${link.currency}` : 'Secure Payment Link'}
                description="Complete your secure payment."
            />
            <div className="min-h-screen flex items-center justify-center px-4 py-10 pg-flow">
                <div className="w-full max-w-xl">
                    {/* Security badge */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span>Secure checkout • SSL encrypted</span>
                        </div>
                        {link && (
                            <p className="text-[11px] font-bold text-slate-400">
                                Powered by YouTubeAdWords Payment Links
                            </p>
                        )}
                    </div>

                    <div className="bg-white rounded-[28px] shadow-2xl border border-slate-200 overflow-hidden">
                        {/* Header */}
                        <div className="px-7 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 text-white">
                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <Loader2 className="w-5 h-5 animate-spin text-sky-300" />
                                    <div>
                                        <p className="text-sm font-black">Loading payment link…</p>
                                        <p className="text-xs text-slate-200">
                                            Please wait while we verify this link.
                                        </p>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-300" />
                                    <div>
                                        <p className="text-sm font-black">Link unavailable</p>
                                        <p className="text-xs text-slate-200">{error}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between gap-4 flex-wrap">
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-300 mb-1.5">
                                            Pay to
                                        </p>
                                        <h1 className="text-xl font-black leading-tight">
                                            {link.merchant?.name || link.merchant?.username || 'Merchant'}
                                        </h1>
                                        <p className="text-xs text-slate-300 mt-1">{link.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black">
                                            ${link.amount.toFixed(2)}
                                        </p>
                                        <p className="text-[11px] text-slate-300 mt-1">
                                            {link.currency} • {link.type === 'REUSABLE' ? 'Reusable link' : 'One-time link'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Body */}
                        <div className="px-7 py-6">
                            {loading ? (
                                <div className="py-10 flex flex-col items-center justify-center text-slate-400 text-sm font-bold">
                                    <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4" />
                                    Verifying payment link…
                                </div>
                            ) : error ? (
                                <div className="py-8 text-sm font-bold text-slate-600 flex flex-col items-center text-center gap-3">
                                    <AlertCircle className="w-8 h-8 text-amber-400" />
                                    <p>{error}</p>
                                    <p className="text-xs text-slate-400">
                                        If you believe this is a mistake, please contact the
                                        merchant who shared this link with you.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 mb-5 text-[11px] text-slate-500 font-bold leading-relaxed">
                                        <p>
                                            You're about to pay{' '}
                                            <span className="text-slate-900 font-black">
                                                ${link.amount.toFixed(2)} {link.currency}
                                            </span>{' '}
                                            to{' '}
                                            <span className="text-slate-900 font-black">
                                                {link.merchant?.name || link.merchant?.username || 'this merchant'}
                                            </span>
                                            .
                                        </p>
                                        {link.notes && (
                                            <p className="mt-1">
                                                Note from merchant:{' '}
                                                <span className="text-slate-700">{link.notes}</span>
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        {/* Email */}
                                        <div>
                                            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                                                Your email address
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => {
                                                        setEmail(e.target.value);
                                                        setEmailError('');
                                                    }}
                                                    placeholder="you@example.com"
                                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all outline-none ${emailError ? 'border-red-500' : 'border-gray-100 focus:border-brand-red'}`}
                                                />
                                            </div>
                                            {emailError && (
                                                <p className="mt-1 text-[11px] font-bold text-red-600">
                                                    {emailError}
                                                </p>
                                            )}
                                        </div>

                                        {/* Security notice */}
                                        <div className="bg-gradient-to-r from-sky-50 to-emerald-50 border border-sky-100 rounded-2xl p-3 text-[11px] text-slate-600 font-bold flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                            <span>
                                                Your card details are processed by our PCI-compliant
                                                partners. We never store full card numbers.
                                            </span>
                                        </div>

                                        {payError && (
                                            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                                {payError}
                                            </div>
                                        )}

                                        {/* Pay buttons */}
                                        <div className="space-y-2 pt-2">
                                            {showCard && (
                                                <button
                                                    type="button"
                                                    disabled={isProcessing}
                                                    onClick={() => handlePay('card')}
                                                    className="w-full h-12 rounded-xl border-2 border-brand-red bg-red-50 text-brand-red font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                                >
                                                    {isProcessing ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <CreditCard className="w-4 h-4" />
                                                    )}
                                                    {isProcessing ? 'Processing…' : 'Pay with Card'}
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                disabled={isProcessing}
                                                onClick={() => handlePay('crypto')}
                                                className="w-full h-12 rounded-xl border-2 border-amber-500 bg-amber-50 text-amber-700 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {isProcessing ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Coins className="w-4 h-4" />
                                                )}
                                                {isProcessing ? 'Processing…' : 'Pay with Crypto'}
                                            </button>
                                        </div>

                                        <p className="text-[10px] text-gray-400 text-center font-bold pt-2">
                                            Instant Confirmation • 24/7 Support • 100% Safe
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <PaymentLoadingOverlay isOpen={isProcessing} />
        </Layout>
    );
}
