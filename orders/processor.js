/**
 * orders/processor.js
 * Handles order processing pipeline — validation, billing, fulfillment.
 */

const { calculateOrderTotal } = require('../billing/calculator');

/**
 * Validates an incoming order object.
 * @param {Object} order
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateOrder(order) {
  const errors = [];

  if (!order.id) errors.push('Order ID is required');
  if (!order.customerId) errors.push('Customer ID is required');
  if (!Array.isArray(order.items) || order.items.length === 0) {
    errors.push('Order must contain at least one item');
  }

  order.items?.forEach((item, i) => {
    if (!item.price || item.price <= 0) errors.push(`Item ${i}: invalid price`);
    if (!item.quantity || item.quantity <= 0) errors.push(`Item ${i}: invalid quantity`);
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Processes a validated order through the billing pipeline.
 * @param {Object} order
 * @returns {Object} Processed order with total and status
 */
function processOrder(order) {
  const { valid, errors } = validateOrder(order);

  if (!valid) {
    return { status: 'failed', errors };
  }

  const total = calculateOrderTotal(order);

  return {
    status: 'processed',
    orderId: order.id,
    customerId: order.customerId,
    total,
    processedAt: new Date().toISOString(),
  };
}

module.exports = { validateOrder, processOrder };
