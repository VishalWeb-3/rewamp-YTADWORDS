/**
 * Checks that an email address is well formed. Any domain is accepted, including
 * business addresses; the backend re-validates every address it receives.
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const e = String(email).trim();
  if (e.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(e);
};

export const INVALID_EMAIL_MESSAGE = 'Please enter a valid email address.';
