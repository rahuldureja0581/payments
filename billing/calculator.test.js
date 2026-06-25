/**
 * billing/calculator.test.js
 * Test suite for payment calculation logic.
 */

const { applyPaymentCap, calculateOrderTotal, formatCurrency } = require('./calculator');

describe('applyPaymentCap', () => {
  test('returns correct amount for small orders', () => {
    expect(applyPaymentCap(100, 1.0)).toBe(100);
  });

  test('returns correct amount for orders just under $10K', () => {
    expect(applyPaymentCap(9999, 1.0)).toBe(9999);
  });

  test('returns correct amount for orders at exactly $10,737', () => {
    expect(applyPaymentCap(10737, 1.0)).toBe(10737);
  });

  test('returns correct amount for orders over $10K — THIS FAILS WITH BUG', () => {
    // BUG: this currently returns 10000 instead of 14750
    expect(applyPaymentCap(14750, 1.0)).toBe(14750);
  });

  test('returns correct amount for large enterprise orders', () => {
    expect(applyPaymentCap(50000, 1.0)).toBe(50000);
  });

  test('applies tax rate correctly', () => {
    expect(applyPaymentCap(1000, 1.08)).toBe(1080);
  });
});

describe('calculateOrderTotal', () => {
  test('calculates single item order correctly', () => {
    const order = {
      items: [{ price: 100, quantity: 2 }]
    };
    expect(calculateOrderTotal(order)).toBe(200);
  });

  test('calculates multi-item order correctly', () => {
    const order = {
      items: [
        { price: 500, quantity: 3 },
        { price: 250, quantity: 2 }
      ]
    };
    expect(calculateOrderTotal(order)).toBe(2000);
  });

  test('calculates large order over $10K correctly — THIS FAILS WITH BUG', () => {
    // This order totals $14,750 — triggers the overflow bug
    const order = {
      items: [
        { price: 2950, quantity: 5 }
      ]
    };
    expect(calculateOrderTotal(order)).toBe(14750);
  });
});

describe('formatCurrency', () => {
  test('formats whole dollar amounts', () => {
    expect(formatCurrency(100)).toBe('$100.00');
  });

  test('formats decimal amounts', () => {
    expect(formatCurrency(99.5)).toBe('$99.50');
  });
});
