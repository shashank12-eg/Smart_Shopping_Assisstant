/**
 * Utility functions for SmartShopping
 */

// Formats amount strictly into Indian Rupee format e.g. ₹64,999 or ₹1,04,999
export function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const num = Number(amount);
  return '₹' + num.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    style: 'decimal'
  });
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
