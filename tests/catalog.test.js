const { describe, it } = require('node:test');
const assert = require('node:assert');

describe('ShopSphere Catalog & Search', () => {
  it('should filter products by category', () => {
    const products = [
      { id: '1', title: 'Running Shoes', category: 'Footwear' },
      { id: '2', title: 'Casual Hoodie', category: 'Apparel' },
      { id: '3', title: 'Leather Boots', category: 'Footwear' }
    ];
    const filtered = products.filter(p => p.category === 'Footwear');
    assert.strictEqual(filtered.length, 2);
  });

  it('should sort products by price ascending', () => {
    const products = [
      { id: '1', price: 1500 },
      { id: '2', price: 800 },
      { id: '3', price: 2300 }
    ];
    const sorted = [...products].sort((a, b) => a.price - b.price);
    assert.strictEqual(sorted[0].price, 800);
    assert.strictEqual(sorted[2].price, 2300);
  });
});
