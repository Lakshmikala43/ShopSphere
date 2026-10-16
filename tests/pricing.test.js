const { describe, it } = require('node:test');
const assert = require('node:assert');

describe('ShopSphere Dynamic Pricing & Taxes', () => {
  it('should calculate GST tax rate of 18%', () => {
    const netAmount = 10000;
    const gstRate = 0.18;
    const tax = netAmount * gstRate;
    const gross = netAmount + tax;
    assert.strictEqual(tax, 1800);
    assert.strictEqual(gross, 11800);
  });

  it('should award free shipping for orders exceeding threshold', () => {
    const freeShippingThreshold = 999;
    const orderTotal = 1499;
    const shippingFee = orderTotal >= freeShippingThreshold ? 0 : 99;
    assert.strictEqual(shippingFee, 0);
  });
});
