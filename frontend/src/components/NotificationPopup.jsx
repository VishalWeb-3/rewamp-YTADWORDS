import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NotificationPopup = () => {
    const location = useLocation();

    const EXCLUDED_PATHS = [
        '/checkout', '/order-details', '/payment', '/pay', '/get-started',
        '/success', '/failure', '/payment-links'
    ];

    const isExcludedPath = (pathname) => {
        if (pathname.includes('upgrade')) return true;
        if (pathname === '/login' || pathname === '/register') return true;
        return EXCLUDED_PATHS.some(
            (p) => pathname === p || pathname.startsWith(p + '/') || pathname.includes(p)
        );
    };

    useEffect(() => {
        // Check if browser supports notifications
        if (!('Notification' in window)) return;

        // Don't request on excluded paths
        if (isExcludedPath(location.pathname)) return;

        // Check if already granted or denied
        if (Notification.permission !== 'default') return;

        // Check if previously dismissed (wait 7 days before asking again)
        const dismissedAt = localStorage.getItem('notificationRequestDismissedAt_yt');
        if (dismissedAt) {
            const daysSinceDismissed = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
            if (daysSinceDismissed < 7) return;
        }

        // Directly request browser notification permission after 5 seconds
        const timer = setTimeout(() => {
            Notification.requestPermission().then((permission) => {
                if (permission === 'denied') {
                    // User denied - remember for 7 days
                    localStorage.setItem('notificationRequestDismissedAt_yt', Date.now().toString());
                } else if (permission === 'granted') {
                    // Permission granted - show welcome notification
                    localStorage.setItem('notificationPopupGranted_yt', 'true');
                    new Notification('Welcome to YouTube AdWords! 🎉', {
                        body: 'You\'ll now receive updates about your orders and exclusive offers!',
                        icon: '/favicon.svg',
                        badge: '/favicon.svg'
                    });
                }
            });
        }, 5000);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    // This component doesn't render anything - it just triggers the browser dialog
    return null;
};

export default NotificationPopup;
