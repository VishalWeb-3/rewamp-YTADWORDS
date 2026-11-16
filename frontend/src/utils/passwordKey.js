// The browser stretches the password with PBKDF2 and sends only the derived key, never the password.
// The server stores an HMAC of that key. Changing these settings locks out every existing account.
const ITERATIONS = 600000; // OWASP's figure for PBKDF2-HMAC-SHA256
const KEY_BYTES = 32;

const toHex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

/** A new random salt for signup (32 hex characters). */
export const randomSalt = () => toHex(crypto.getRandomValues(new Uint8Array(16)));

/** The 64-character key to send to the API in place of the password. */
export async function derivePasswordKey(password, saltHex) {
  const encoder = new TextEncoder();
  const base = await crypto.subtle.importKey('raw', encoder.encode(password.normalize('NFKC')), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: encoder.encode(saltHex), iterations: ITERATIONS },
    base,
    KEY_BYTES * 8
  );
  return toHex(new Uint8Array(bits));
}
