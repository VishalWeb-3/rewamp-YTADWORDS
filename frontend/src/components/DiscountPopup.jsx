import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { isValidEmail } from '../utils/emailValidator';

// Use same API as rest of app (VITE_API_URL). Empty = same-origin /api.
const API_BASE = import.meta.env.VITE_API_URL || '';

const DiscountCircle = ({ onClick, discountLabel, isVisible }) => {
    if (isVisible) return null; // Hide circle when popup is open

    return (
        <button
            onClick={onClick}
            aria-label={`Open discount offer: ${discountLabel || '20% off'}`}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[9998] group flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#1e293b] text-white rounded-full shadow-2xl hover:bg-black transition-all duration-300 active:scale-95 animate-in slide-in-from-right-10 pointer-events-auto"
        >
            <div className="absolute inset-0 rounded-full border-2 border-white/20 scale-110 group-hover:scale-125 transition-transform duration-500"></div>

            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-tighter opacity-80 leading-none mb-0.5">Save</span>
            <span className="text-lg md:text-xl font-bold leading-none">{(discountLabel || '20%').replace(/\s*off$/i, '')}</span>
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-tighter opacity-80 leading-none mt-0.5">OFF</span>

            {/* Ripple Effect */}
            <div className="absolute inset-0 rounded-full bg-white/10 animate-ping duration-[2000ms] -z-10"></div>
        </button>
    );
};

export default function DiscountPopup() {
    const location = useLocation();
    // Settings come from the popup service; without them no offer is shown (nothing to honour)
    const [settings, setSettings] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSubscribed] = useState(() => {
        try {
            return !!localStorage.getItem('discountPopupSuccess_yt');
        } catch {
            return false;
        }
    });

    // List of payment pages to exclude
    const PAYMENT_PAGES = [
        '/checkout',
        '/pay',
        '/payment/success',
        '/payment/failure',
        '/get-started'
    ];

    const isExcludedPath = (pathname) => {
        if (pathname.includes('upgrade')) return true;
        return PAYMENT_PAGES.some(path =>
            pathname === path || pathname.startsWith(path + '/') || pathname.startsWith('/pay/')
        );
    };

    const isPaymentPage = isExcludedPath(location.pathname);

    useEffect(() => {
        if (isPaymentPage || isSubscribed) return;
        let cancelled = false;
        let timer;

        fetch(`${API_BASE}/api/popups/public?site=youtubeadwords`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (cancelled || !data?.isActive) return;
                setSettings(data);
                // Default: 15 seconds. If dismissed before: 125 seconds.
                const hasCancelled = localStorage.getItem('discountPopupCancelled_yt');
                timer = setTimeout(() => {
                    setIsVisible(true);
                    sessionStorage.setItem('discountPopupOpen_yt', 'true');
                }, hasCancelled ? 125000 : 15000);
            })
            .catch(() => {
                /* popup service unavailable: show nothing */
            });

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [isPaymentPage, isSubscribed]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/popups/submit-email?site=youtubeadwords`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    details: `YouTube Ads Discount Popup (${settings.discountLabel})`
                })
            });
            if (!res.ok) throw new Error(`Signup failed (${res.status})`);
            setIsSubmitted(true);
            localStorage.setItem('discountPopupSuccess_yt', 'true');
            sessionStorage.removeItem('discountPopupOpen_yt');
        } catch (err) {
            console.error('Failed to submit email:', err);
            setError('We could not sign you up right now. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const openPopup = () => {
        setIsVisible(true);
        sessionStorage.setItem('discountPopupOpen_yt', 'true');
    };

    const closePopup = () => {
        setIsVisible(false);
        sessionStorage.removeItem('discountPopupOpen_yt');
        // Mark as cancelled so next visit waits 125s (not after a successful signup)
        if (!isSubmitted) localStorage.setItem('discountPopupCancelled_yt', 'true');
    };

    useEffect(() => {
        if (!isVisible) return;
        const onKey = (e) => e.key === 'Escape' && closePopup();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
        // closePopup is recreated each render and only reads isSubmitted, which is already a dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible, isSubmitted]);

    if (isPaymentPage || !settings || (isSubscribed && !isSubmitted)) return null;


    return (
        <>
            {/* The Floating Circle Badge */}
            <DiscountCircle
                onClick={openPopup}
                discountLabel={settings?.discountLabel}
                isVisible={isVisible}
            />

            {/* The Popup */}
            {isVisible && (
                <div role="dialog" aria-modal="true" aria-label="Discount offer" className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 max-h-[90vh] overflow-y-auto">
                        {/* Close Button */}
                        <button
                            onClick={closePopup}
                            aria-label="Close"
                            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-gray-400 hover:text-black transition-colors z-20 bg-white/80 backdrop-blur-sm rounded-full"
                        >
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {!isSubmitted ? (
                            <div className="p-6 md:p-12 flex flex-col items-center text-center">
                                <div className="flex items-center gap-2 mb-6 md:mb-8 select-none">
                                    <span className="text-xl md:text-2xl font-black text-[#1e293b]">YouTube Ads</span>
                                    <div className="w-2 h-2 rounded-full bg-red-600 mt-2"></div>
                                </div>

                                <div className="w-12 md:w-16 h-1 bg-red-600 rounded-full mb-6 md:mb-8"></div>

                                <span className="text-xs md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-500 mb-2 md:mb-4">{settings.title}</span>
                                <h2 className="text-5xl md:text-7xl font-black text-[#1e293b] mb-2 leading-none break-words max-w-full px-2">{settings.discountLabel}</h2>
                                <p className="text-sm md:text-base font-black text-red-600 uppercase tracking-[0.1em] md:tracking-[0.15em] mb-8 md:mb-10">{settings.subTitle}</p>

                                <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (error) setError('');
                                        }}
                                        placeholder="Email Address"
                                        className={`w-full h-16 px-6 rounded-xl border-2 outline-none transition-all text-lg font-medium placeholder:text-gray-300 ${error ? 'border-red-500 bg-red-50/50' : 'border-gray-100 focus:border-red-500'}`}
                                    />
                                    {error && (
                                        <p className="text-red-600 text-[11px] font-bold text-left px-2 animate-in fade-in slide-in-from-top-1">{error}</p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-16 bg-[#1e293b] hover:bg-black text-white font-black rounded-xl text-sm uppercase tracking-widest transition-all shadow-xl shadow-gray-200 active:scale-95 disabled:opacity-50"
                                    >
                                        {loading ? 'Processing...' : settings.buttonText}
                                    </button>
                                    <p className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest">{settings.footerText}</p>
                                </form>
                            </div>
                        ) : (
                            <div className="p-8 md:p-16 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6 md:mb-8 border border-green-100">
                                    <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-[#1e293b] mb-4 leading-tight">{settings.successMessage}</h2>
                                <p className="text-gray-500 font-medium text-base md:text-lg leading-relaxed mb-8 md:mb-10">{settings.successSubMessage}</p>
                                <button
                                    onClick={closePopup}
                                    className="w-full md:w-auto px-10 py-4 bg-[#1e293b] text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg"
                                >
                                    Continue Browsing
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
