/**
 * utils/format.js — small formatting helpers used all over the app.
 */

/** "2025-01-15" → "15 Jan 2025" */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

/** 12500 → "₹12,500" */
export const formatCurrency = (value) => {
  const n = Number(value || 0);
  return `₹${n.toLocaleString('en-IN')}`;
};

/** Mood → emoji used in memory cards */
export const MOOD_EMOJI = {
  Happy: '😊',
  Excited: '🤩',
  Adventurous: '🧭',
  Relaxed: '😌',
  Grateful: '🙏',
  Tired: '😴',
  Nostalgic: '🌙',
};

/** Mood → colour used in memory cards */
export const MOOD_COLOR = {
  Happy: '#f59e0b',
  Excited: '#ef4444',
  Adventurous: '#0891b2',
  Relaxed: '#10b981',
  Grateful: '#8b5cf6',
  Tired: '#64748b',
  Nostalgic: '#6366f1',
};
