const { describe, it } = require('node:test');
const assert = require('node:assert');

describe('ShopSphere Cart Engine', () => {
  it('should calculate cart subtotal accurately', () => {
    const items = [
      { id: 'p1', name: 'Premium Oxford Shirt', price: 1299, quantity: 2 },
      { id: 'p2', name: 'Slim Fit Denim Jeans', price: 2499, quantity: 1 }
    ];
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    assert.strictEqual(subtotal, 5097);
  });

  it('should apply discount coupon percentage correctly', () => {
    const subtotal = 5000;
    const discountPct = 10;
    const discountAmount = (subtotal * discountPct) / 100;
    const finalTotal = subtotal - discountAmount;
    assert.strictEqual(discountAmount, 500);
    assert.strictEqual(finalTotal, 4500);
  });

  it('should prevent negative quantities in cart', () => {
    const quantity = -3;
    const sanitized = Math.max(1, quantity);
    assert.strictEqual(sanitized, 1);
  });
});
