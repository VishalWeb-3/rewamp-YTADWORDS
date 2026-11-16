import { formatQuantity } from './quantity';

const API_BASE = import.meta.env.VITE_API_URL || '';

// Database statuses → the labels and filter tabs shown to customers
export const STATUS_INFO = {
  PENDING: { key: 'pending', label: 'Awaiting payment', color: 'bg-yellow-100 text-yellow-800' },
  PROGRESS: { key: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  COMPLETED: { key: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  CANCELED: { key: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
};

export const statusInfo = (status) =>
  STATUS_INFO[status] || { key: 'other', label: status || 'Unknown', color: 'bg-gray-100 text-gray-800' };

export const paymentMethodLabel = (method) => (method === 'CARD' ? 'Credit/Debit Card' : 'Cryptocurrency');

export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

/**
 * The API stores one row per item. Rows paid together share an externalOrderId,
 * so group them into one order for display. Each group is identified by its first row's id.
 */
export function groupOrders(rows) {
  const groups = new Map();
  for (const row of rows) {
    const key = row.externalOrderId || `row-${row.id}`;
    if (!groups.has(key)) {
      groups.set(key, {
        id: row.id,
        externalOrderId: row.externalOrderId,
        status: row.status,
        paymentMethod: row.paymentMethod,
        createdAt: row.createdAt,
        total: 0,
        items: [],
      });
    }
    const group = groups.get(key);
    group.total += row.price;
    group.items.push({
      id: row.id,
      service: row.service,
      platform: row.platform,
      quantity: formatQuantity(row.amount),
      price: row.price,
      link: row.username,
      status: row.status,
    });
  }
  return [...groups.values()];
}

/** Fetches the logged-in user's orders. Throws with status 401 when logged out. */
export async function fetchMyOrders() {
  const res = await fetch(`${API_BASE}/api/orders`, { credentials: 'include' });
  if (!res.ok) {
    const err = new Error(res.status === 401 ? 'Please log in to see your orders.' : 'Could not load your orders.');
    err.status = res.status;
    throw err;
  }
  return groupOrders(await res.json());
}
