/**
 * orders/processor.test.js
 * Test suite for order processing pipeline.
 */

const { validateOrder, processOrder } = require('./processor');

describe('validateOrder', () => {
  const validOrder = {
    id: 'ORD-001',
    customerId: 'CUST-123',
    items: [{ price: 100, quantity: 2 }]
  };

  test('validates a correct order', () => {
    expect(validateOrder(validOrder).valid).toBe(true);
  });

  test('rejects order with no ID', () => {
    const { valid, errors } = validateOrder({ ...validOrder, id: null });
    expect(valid).toBe(false);
    expect(errors).toContain('Order ID is required');
  });

  test('rejects order with empty items', () => {
    const { valid, errors } = validateOrder({ ...validOrder, items: [] });
    expect(valid).toBe(false);
    expect(errors).toContain('Order must contain at least one item');
  });

  test('rejects item with zero price', () => {
    const order = { ...validOrder, items: [{ price: 0, quantity: 1 }] };
    expect(validateOrder(order).valid).toBe(false);
  });
});

describe('processOrder', () => {
  test('processes a valid small order', () => {
    const order = {
      id: 'ORD-001',
      customerId: 'CUST-123',
      items: [{ price: 500, quantity: 2 }]
    };
    const result = processOrder(order);
    expect(result.status).toBe('processed');
    expect(result.total).toBe(1000);
  });

  test('returns failed status for invalid order', () => {
    const result = processOrder({ id: null, customerId: null, items: [] });
    expect(result.status).toBe('failed');
  });

  test('processes large order over $10K — THIS FAILS WITH BUG', () => {
    const order = {
      id: 'ORD-002',
      customerId: 'CUST-APEX',
      items: [{ price: 2950, quantity: 5 }]
    };
    const result = processOrder(order);
    expect(result.status).toBe('processed');
    expect(result.total).toBe(14750);
  });
});
