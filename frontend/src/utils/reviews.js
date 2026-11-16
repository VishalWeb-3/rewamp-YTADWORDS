import { readJson } from './orderItems';

const API_BASE = import.meta.env.VITE_API_URL || '';

/** Sends a "Leave a review" form to the API. Reviews are held for moderation before they appear. */
export async function submitReview({ page, name, email, rating, text }) {
  if (!rating) throw new Error('Please choose a star rating.');
  const res = await fetch(`${API_BASE}/api/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page, name, email, rating, text }),
  });
  const data = await readJson(res);
  if (!res.ok) throw new Error(data.error || 'Could not send your review. Please try again.');
  return data;
}
