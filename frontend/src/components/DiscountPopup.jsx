import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:3001/api';

export default function DiscountPopup() {
    const location = useLocation();
    const [settings, setSettings] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Only show on home page as requested
        if (location.pathname !== '/') return;

        const fetchSettings = async () => {
            try {
                const res = await fetch(`${API_BASE}/popups/public?site=youtubeadwords`);
                const data = await res.json();
                if (data && data.isActive) {
                    setSettings(data);
                    // Show after a short delay
                    const timer = setTimeout(() => {
                        const isDone = localStorage.getItem('discountPopupSuccess_yt');
                        if (isDone) return;

                        const dismissedAt = localStorage.getItem('discountPopupDismissedAt_yt');
                        if (dismissedAt) {
                            const elapsed = Date.now() - parseInt(dismissedAt);
                            if (elapsed < 10 * 60 * 1000) return; // 10 minutes in ms
                        }

                        setIsVisible(true);
                    }, 3000);
                    return () => clearTimeout(timer);
                }
            } catch (err) {
                console.error('Failed to load popup settings:', err);
            }
        };

        fetchSettings();
    }, [location.pathname]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            await fetch(`${API_BASE}/popups/submit-email?site=youtubeadwords`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    details: `YouTube Ads Discount Popup (${settings.discountLabel})`
                })
            });
            setIsSubmitted(true);
            localStorage.setItem('discountPopupSuccess_yt', 'true');
            localStorage.removeItem('discountPopupDismissedAt_yt');
        } catch (err) {
            console.error('Failed to submit email:', err);
        } finally {
            setLoading(false);
        }
    };

    const closePopup = () => {
        setIsVisible(false);
        if (!isSubmitted) {
            localStorage.setItem('discountPopupDismissedAt_yt', Date.now().toString());
        }
    };

    if (!isVisible || !settings) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                {/* Close Button */}
                <button
                    onClick={closePopup}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors z-10"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {!isSubmitted ? (
                    <div className="p-8 md:p-12 flex flex-col items-center text-center">
                        <div className="flex items-center gap-2 mb-8 select-none">
                            <span className="text-2xl font-black text-[#1e293b]">YouTube Ads</span>
                            <div className="w-2 h-2 rounded-full bg-red-600 mt-2"></div>
                        </div>

                        <div className="w-16 h-1 bg-red-600 rounded-full mb-8"></div>

                        <span className="text-sm font-black uppercase tracking-[0.3em] text-gray-500 mb-4">{settings.title}</span>
                        <h2 className="text-6xl md:text-7xl font-black text-[#1e293b] mb-2 leading-none">{settings.discountLabel}</h2>
                        <p className="text-base font-black text-red-600 uppercase tracking-[0.15em] mb-10">{settings.subTitle}</p>

                        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                className="w-full h-16 px-6 rounded-xl border-2 border-gray-100 focus:border-red-500 outline-none transition-all text-lg font-medium placeholder:text-gray-300"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 bg-[#1e293b] hover:bg-black text-white font-black rounded-xl text-sm uppercase tracking-widest transition-all shadow-xl shadow-gray-200 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : settings.buttonText}
                            </button>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{settings.footerText}</p>
                        </form>
                    </div>
                ) : (
                    <div className="p-8 md:p-16 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-8 border border-green-100">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-black text-[#1e293b] mb-4 leading-tight">{settings.successMessage}</h2>
                        <p className="text-gray-500 font-medium text-lg leading-relaxed mb-10">{settings.successSubMessage}</p>
                        <button
                            onClick={closePopup}
                            className="px-10 py-4 bg-[#1e293b] text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg"
                        >
                            Continue Browsing
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
