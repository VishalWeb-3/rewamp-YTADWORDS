import { Link } from 'react-router-dom';

/**
 * Full-screen overlay shown when user is banned.
 * Same as buzzoid.com – allows contact for support.
 */
export default function BannedOverlay({ reason }) {
  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95"
      style={{ pointerEvents: 'auto' }}
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-md mx-4 p-8 bg-red-950/90 border-2 border-red-500 rounded-2xl text-center shadow-2xl">
        <div className="text-6xl mb-4">⛔</div>
        <h1 className="text-2xl font-black text-white mb-4 uppercase tracking-wide">
          You Are Banned
        </h1>
        <p className="text-red-200 font-medium mb-2">
          Your account has been suspended. No further actions are allowed.
        </p>
        {reason && (
          <p className="text-red-300/90 text-sm mt-4 p-4 bg-black/30 rounded-xl">
            <span className="font-bold">Reason:</span> {reason}
          </p>
        )}
        <p className="text-slate-400 text-sm mt-6 mb-4">
          If you believe this is a mistake, you can contact support.
        </p>
        <Link
          to="/contact"
          className="inline-block px-6 py-3 bg-white text-red-700 font-bold rounded-xl hover:bg-red-100 transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
