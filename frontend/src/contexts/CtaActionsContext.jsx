import { createContext, useContext, useState, useEffect } from 'react';

const CtaActionsContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || '';

const defaultStatus = {
    add_to_cart: true,
    buy: true,
    submit_ticket: true,
};

export function CtaActionsProvider({ children, userId }) {
    const [status, setStatus] = useState(defaultStatus);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = userId
            ? `${API_BASE}/api/cta-actions/status?userId=${userId}`
            : `${API_BASE}/api/cta-actions/status`;

        fetch(url)
            .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Not found'))))
            .then((data) => setStatus({ ...defaultStatus, ...data }))
            .catch(() => setStatus(defaultStatus))
            .finally(() => setLoading(false));
    }, [userId]);

    const isEnabled = (key) => status[key] !== false;

    return (
        <CtaActionsContext.Provider value={{ status, loading, isEnabled }}>
            {children}
        </CtaActionsContext.Provider>
    );
}

export const useCtaActions = () => useContext(CtaActionsContext);
