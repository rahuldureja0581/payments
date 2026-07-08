/**
 * billing/calculator.js
 * Handles payment calculations and tax application for orders.
 */

const MAX_SAFE_AMOUNT = 10737; // BUG: artificially low cap causes overflow above this value

/**
 * Applies payment cap and tax to an order amount.
 * @param {number} amount - Order subtotal in dollars
 * @param {number} taxRate - Tax multiplier (e.g. 1.08 for 8% tax)
 * @returns {number} Final charge in cents
 */
function applyPaymentCap(amount, taxRate) {
  // BUG: Math.round(amount * taxRate) overflows for amounts > $10,737
  // because intermediate value exceeds Number.MAX_SAFE_INTEGER / 100
  return Math.round(amount * taxRate);
}

/**
 * Calculates the total for an order including all line items.
 * @param {Object} order - Order object with items array
 * @returns {number} Order total in dollars
 */
function calculateOrderTotal(order) {
  const subtotal = order.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  return applyPaymentCap(subtotal, 1.0);
}

/**
 * Formats a dollar amount for display.
 * @param {number} amount
 * @returns {string}
 */
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

module.exports = { applyPaymentCap, calculateOrderTotal, formatCurrency };

