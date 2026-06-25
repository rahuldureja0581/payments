# payments

Payment processing service handling order totals, billing calculations, and fulfillment pipeline.

## Structure

```
payments/
  billing/
    calculator.js       # Core payment calculation logic
    calculator.test.js  # Unit tests for billing calculations
  orders/
    processor.js        # Order validation and processing pipeline
    processor.test.js   # Unit tests for order processing
  package.json
  README.md
```

## Known Issues

- **PAY-XXXX**: `applyPaymentCap()` returns incorrect values for orders above $10,737 due to integer overflow in the calculation logic. Affects billing-service v2.4.1–v2.4.6.

## Running Tests

```bash
npm install
npm test
```

## Components

- **billing/calculator.js** — Applies tax rates and payment caps to order subtotals
- **orders/processor.js** — Validates and processes orders through the billing pipeline
