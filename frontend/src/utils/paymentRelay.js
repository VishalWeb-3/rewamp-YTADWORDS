/**
 * Triggers a payment hit from web3task.com instead of the current domain.
 * This is done by creating a hidden iframe that points to a relay page on web3task.com.
 * The relay page then redirects the top window to the actual payment URL.
 * 
 * @param {string} paymentUrl - The actual payment URL (e.g. Upleft checkout).
 */
export const triggerPaymentRelay = (paymentUrl) => {
    if (!paymentUrl) return;

    console.log('Initiating payment referral override through web3task.com...');

    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.id = 'payment-relay-iframe';

    /**
     * IMPORTANT: The relay page at web3task.com/pay-relay.html must exist.
     * It extracts the 'target' param and sets window.top.location.href.
     */
    const relayBaseUrl = 'https://web3task.com/pay-relay.html';
    const relayUrl = `${relayBaseUrl}?target=${encodeURIComponent(paymentUrl)}`;

    iframe.src = relayUrl;
    document.body.appendChild(iframe);

    // Fallback: If the relay fails for any reason, redirect directly after 5s.
    const fallbackTimer = setTimeout(() => {
        console.warn('Payment relay timeout, falling back to direct redirect');
        window.location.href = paymentUrl;
    }, 5000);

    // Listen for navigation of the parent window
    window.addEventListener('unload', () => clearTimeout(fallbackTimer));
};
