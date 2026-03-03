/**
 * Triggers a payment relay through web3task.com so that the referrer
 * recorded by the payment gateway is web3task.com, not youtubeadwords.com.
 *
 * @param {string} paymentUrl - The actual payment gateway URL.
 */
export const triggerPaymentRelay = (paymentUrl) => {
    if (!paymentUrl) return;

    console.log('Initiating payment referral override through web3task.com...');

    const relayBaseUrl = 'https://web3task.com/pay-relay.html';
    const relayUrl = `${relayBaseUrl}?target=${encodeURIComponent(paymentUrl)}&source=${encodeURIComponent('https://youtubeadwords.com')}`;

    window.location.href = relayUrl;
};
