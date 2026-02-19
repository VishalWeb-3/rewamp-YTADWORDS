import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const MESSAGES = [
    "Connecting to secure payment gateway...",
    "Verifying order details...",
    "Preparing your package...",
    "Redirecting to payment provider..."
];

export default function PaymentLoadingOverlay({ isOpen }) {
    const [messageIndex, setMessageIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [videoError, setVideoError] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setProgress(0);
            setMessageIndex(0);
            return;
        }

        // Progress bar animation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 95) return 95; // Hold at 95% until redirect
                return prev + (Math.random() * 5);
            });
        }, 200);

        // Message rotation
        const messageInterval = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % MESSAGES.length);
        }, 2000);

        return () => {
            clearInterval(progressInterval);
            clearInterval(messageInterval);
        };
    }, [isOpen]);

    // Fallback animation if video is missing
    const renderFallback = () => (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-brand-red rounded-full animate-spin border-t-transparent"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-red-100/50 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 backdrop-blur-sm transition-opacity duration-300">
            <div className="w-full max-w-md p-8 text-center">
                {/* Video Container */}
                <div className="mb-8 relative w-32 h-32 mx-auto overflow-hidden rounded-full shadow-lg bg-gray-100 flex items-center justify-center ring-4 ring-gray-50">
                    {!videoError ? (
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            onError={() => setVideoError(true)}
                            className="w-full h-full object-cover"
                        >
                            <source src="/video/paymentload.mp4" type="video/mp4" />
                        </video>
                    ) : renderFallback()}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Do not close this window
                </h3>

                <p className="text-gray-600 mb-8 min-h-[1.5em] transition-opacity duration-300">
                    {MESSAGES[messageIndex]}
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                    <div
                        className="bg-brand-red h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-400 font-medium">
                    {Math.round(progress)}%
                </p>
            </div>
        </div>,
        document.body
    );
}
