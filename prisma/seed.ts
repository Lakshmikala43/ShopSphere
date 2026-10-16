import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding StyleKart AI database...');

  // Clean existing data
  await prisma.userEvent.deleteMany();
  await prisma.aIStylistSession.deleteMany();
  await prisma.returnRequest.deleteMany();
  await prisma.review.deleteMany();
  await prisma.paymentTransaction.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.seller.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users & Passwords
  const passwordHash = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@stylekart.com',
      passwordHash,
      name: 'StyleKart Admin',
      phone: '+91 98765 43210',
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
  });

  const sellerUser1 = await prisma.user.create({
    data: {
      email: 'seller@stylekart.com',
      passwordHash,
      name: 'Aura Fashion & Trends',
      phone: '+91 98111 22233',
      role: 'SELLER',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
  });

  const sellerUser2 = await prisma.user.create({
    data: {
      email: 'techseller@stylekart.com',
      passwordHash,
      name: 'CyberTech Direct',
      phone: '+91 98222 33344',
      role: 'SELLER',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      email: 'customer@stylekart.com',
      passwordHash,
      name: 'Priya Sharma',
      phone: '+91 98999 88877',
      role: 'CUSTOMER',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    },
  });

  // Default address for customer
  await prisma.address.create({
    data: {
      userId: customerUser.id,
      fullName: 'Priya Sharma',
      phone: '+91 98999 88877',
      line1: 'Flat 402, Green Glen Layout',
      line2: 'Outer Ring Road, Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560103',
      country: 'India',
      isDefault: true,
    },
  });

  // 2. Create Sellers
  const seller1 = await prisma.seller.create({
    data: {
      userId: sellerUser1.id,
      storeName: 'Aura Fashion Hub',
      storeDescription: 'Premier boutique for modern Western, Ethnic, & Streetwear fashion.',
      rating: 4.8,
      isApproved: true,
      logoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=300&q=80',
    },
  });

  const seller2 = await prisma.seller.create({
    data: {
      userId: sellerUser2.id,
      storeName: 'CyberTech & Electronics',
      storeDescription: 'Official distributor of high-end gadgets, smart devices, and gaming accessories.',
      rating: 4.9,
      isApproved: true,
      logoUrl: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=300&q=80',
    },
  });

  // 3. Create Categories
  const categoriesData = [
    { name: 'Fashion', slug: 'fashion', description: 'Clothing, ethnic, streetwear & designer apparel', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80' },
    { name: 'Footwear', slug: 'footwear', description: 'Sneakers, formal shoes, boots & sports shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80' },
    { name: 'Accessories', slug: 'accessories', description: 'Watches, sunglasses, bags & luxury belts', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' },
    { name: 'Beauty', slug: 'beauty', description: 'Skincare, makeup, fragrances & grooming essentials', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80' },
    { name: 'Electronics', slug: 'electronics', description: 'Mobiles, laptops, earbuds & smart electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' },
    { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Furniture, decor, cookware & smart appliances', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Grocery & Daily', slug: 'grocery', description: 'Organic snacks, beverages & household goods', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80' },
    { name: 'Sports & Fitness', slug: 'sports-fitness', description: 'Gym equipment, yoga mats & athletic gear', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80' },
    { name: 'Books & Education', slug: 'books-education', description: 'Bestselling novels, guides & luxury stationery', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80' },
    { name: 'Toys & Baby', slug: 'toys-baby', description: 'Educational toys, games & baby essentials', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80' },
    { name: 'Automotive', slug: 'automotive', description: 'Car accessories, riding helmets & detailing kit', image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Pet Supplies', slug: 'pet-supplies', description: 'Premium food, toys & grooming for pets', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80' },
  ];

  const categoryMap = new Map();
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categoryMap.set(cat.slug, created.id);
  }

  // 4. Seed Products (50+ items)
  const products = [
    // FASHION
    {
      name: 'Elysian Premium Linen Slim Shirt',
      slug: 'elysian-linen-shirt',
      brand: 'Aura Luxe',
      categorySlug: 'fashion',
      sellerId: seller1.id,
      price: 1499,
      discountPercent: 25,
      isFeatured: true,
      description: 'Handcrafted from 100% organic European flax linen. Perfect for modern office wear or casual outings.',
      tags: 'shirt, men, fashion, formal, linen, white, wedding, college',
      specifications: JSON.stringify({ Material: '100% Organic Linen', Fit: 'Slim Fit', Collar: 'Mandarin Collar', Care: 'Machine Wash' }),
      images: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { size: 'M', color: 'Pure White', sku: 'LINEN-WHT-M', stock: 25 },
        { size: 'L', color: 'Pure White', sku: 'LINEN-WHT-L', stock: 18 },
        { size: 'XL', color: 'Sky Blue', sku: 'LINEN-BLU-XL', stock: 12 },
      ]
    },
    {
      name: 'Royale Velvet Anarkali Kurta Set',
      slug: 'royale-velvet-anarkali',
      brand: 'Heritage Threads',
      categorySlug: 'fashion',
      sellerId: seller1.id,
      price: 4999,
      discountPercent: 30,
      isFeatured: true,
      description: 'Opulent deep crimson velvet kurta set featuring hand embroidery, gold zari border and silk dupatta.',
      tags: 'kurta, ethnic, women, wedding, festival, party, dress, traditional',
      specifications: JSON.stringify({ Fabric: 'Micro Velvet', Dupatta: 'Silk Blend', Embroidery: 'Zardozi Handwork' }),
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { size: 'S', color: 'Crimson Red', sku: 'VELV-RED-S', stock: 8 },
        { size: 'M', color: 'Crimson Red', sku: 'VELV-RED-M', stock: 15 },
        { size: 'L', color: 'Emerald Green', sku: 'VELV-GRN-L', stock: 10 },
      ]
    },
    {
      name: 'Urban Street Oversized Heavyweight Hoodie',
      slug: 'urban-street-oversized-hoodie',
      brand: 'StreetKart',
      categorySlug: 'fashion',
      sellerId: seller1.id,
      price: 1999,
      discountPercent: 15,
      isFeatured: false,
      description: '400 GSM brushed fleece cotton hoodie with drop shoulders and kangaroo pocket.',
      tags: 'hoodie, streetwear, casual, winter, college, men, women, trendy',
      specifications: JSON.stringify({ Weight: '400 GSM', Material: '100% Cotton Fleece', Fit: 'Oversized' }),
      images: [
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { size: 'M', color: 'Matte Black', sku: 'HOD-BLK-M', stock: 30 },
        { size: 'L', color: 'Matte Black', sku: 'HOD-BLK-L', stock: 22 },
        { size: 'XL', color: 'Washed Grey', sku: 'HOD-GRY-XL', stock: 14 },
      ]
    },
    {
      name: 'Vogue Tailored Charcoal Trousers',
      slug: 'vogue-tailored-charcoal-trousers',
      brand: 'Aura Luxe',
      categorySlug: 'fashion',
      sellerId: seller1.id,
      price: 1899,
      discountPercent: 20,
      isFeatured: false,
      description: 'Flat front formal trousers with wrinkle-resistant viscose blend and adjustable waistband.',
      tags: 'trousers, pants, formal, office, men, wedding, tailored',
      specifications: JSON.stringify({ Pattern: 'Solid Charcoal', Stretch: '2-way Flex', Closure: 'Zip & Hook' }),
      images: [
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { size: '32', color: 'Charcoal Grey', sku: 'TRS-CHR-32', stock: 20 },
        { size: '34', color: 'Charcoal Grey', sku: 'TRS-CHR-34', stock: 15 },
      ]
    },
    {
      name: 'Boho Floral Chiffon Maxi Dress',
      slug: 'boho-floral-chiffon-maxi-dress',
      brand: 'Aura Luxe',
      categorySlug: 'fashion',
      sellerId: seller1.id,
      price: 2499,
      discountPercent: 35,
      isFeatured: true,
      description: 'Breezy layered maxi dress with ruffle sleeves, tier skirts, and smocked waistline.',
      tags: 'dress, women, casual, date, summer, floral, party, travel',
      specifications: JSON.stringify({ Lining: 'Soft Cotton', Sleeve: 'Ruffle Cap', Neckline: 'V-Neck' }),
      images: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { size: 'S', color: 'Rose Floral', sku: 'DRS-ROS-S', stock: 10 },
        { size: 'M', color: 'Rose Floral', sku: 'DRS-ROS-M', stock: 14 },
      ]
    },

    // FOOTWEAR
    {
      name: 'Starlight Retro High-Top Leather Sneakers',
      slug: 'starlight-retro-high-top-sneakers',
      brand: 'Veloce Footwear',
      categorySlug: 'footwear',
      sellerId: seller1.id,
      price: 3499,
      discountPercent: 20,
      isFeatured: true,
      description: 'Iconic retro high-top silhouette with full-grain leather, padded collar, and vulcanized rubber sole.',
      tags: 'sneakers, shoes, black sneakers, streetwear, footwear, casual, men, college',
      specifications: JSON.stringify({ Upper: 'Genuine Leather', Sole: 'Anti-Slip Rubber', Cushioning: 'Memory Foam' }),
      images: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { size: 'UK 8', color: 'Midnight Black', sku: 'SNK-BLK-8', stock: 12 },
        { size: 'UK 9', color: 'Midnight Black', sku: 'SNK-BLK-9', stock: 19 },
        { size: 'UK 10', color: 'Classic White', sku: 'SNK-WHT-10', stock: 8 },
      ]
    },
    {
      name: 'Monarch Italian Oxfords Formal Shoes',
      slug: 'monarch-italian-oxfords-formal-shoes',
      brand: 'Veloce Footwear',
      categorySlug: 'footwear',
      sellerId: seller1.id,
      price: 2999,
      discountPercent: 10,
      isFeatured: false,
      description: 'Hand-burnished genuine leather Oxford dress shoes designed for grand galas, weddings, and executive meetings.',
      tags: 'formal shoes, oxfords, office, wedding, leather, men, brown',
      specifications: JSON.stringify({ Construction: 'Blake Stitched', Sole: 'Leather Rubber Hybrid' }),
      images: [
        'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { size: 'UK 8', color: 'Tan Brown', sku: 'OXF-BRN-8', stock: 7 },
        { size: 'UK 9', color: 'Tan Brown', sku: 'OXF-BRN-9', stock: 10 },
      ]
    },
    {
      name: 'ProRunner Carbon-Blade Trail Running Shoes',
      slug: 'prorunner-carbon-blade-shoes',
      brand: 'AeroSport',
      categorySlug: 'footwear',
      sellerId: seller1.id,
      price: 3999,
      discountPercent: 25,
      isFeatured: true,
      description: 'Ultra-lightweight mesh upper featuring embedded carbon-fiber spring plate for max energy propulsion.',
      tags: 'running, sports shoes, gym, fitness, men, women, orange',
      specifications: JSON.stringify({ Weight: '210g', Drop: '8mm', Upper: 'Breathable FlyKnit' }),
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { size: 'UK 8', color: 'Flame Orange', sku: 'RUN-ORG-8', stock: 15 },
        { size: 'UK 9', color: 'Flame Orange', sku: 'RUN-ORG-9', stock: 12 },
      ]
    },

    // ACCESSORIES
    {
      name: 'Chronos Mechanical Automatic Skeleton Watch',
      slug: 'chronos-mechanical-automatic-watch',
      brand: 'Chronos Geneva',
      categorySlug: 'accessories',
      sellerId: seller2.id,
      price: 6999,
      discountPercent: 30,
      isFeatured: true,
      description: 'Exquisite open-heart skeleton dial showing 24-jewel self-winding mechanical movement with sapphire glass.',
      tags: 'watch, luxury, automatic, gift, formal, accessories, men',
      specifications: JSON.stringify({ Movement: 'Automatic Mechanical', Glass: 'Sapphire Crystal', WaterResistance: '50m' }),
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { size: '42mm', color: 'Rose Gold & Silver', sku: 'WCH-ROS-42', stock: 5 },
        { size: '42mm', color: 'Stealth Black', sku: 'WCH-BLK-42', stock: 9 },
      ]
    },
    {
      name: 'Aviation Polarized Titanium Aviator Sunglasses',
      slug: 'aviation-polarized-titanium-sunglasses',
      brand: 'Spectra Vision',
      categorySlug: 'accessories',
      sellerId: seller2.id,
      price: 1599,
      discountPercent: 40,
      isFeatured: false,
      description: 'Featherlight aerospace-grade titanium frame with TAC 9-layer HD polarized anti-glare UV400 lenses.',
      tags: 'sunglasses, shades, eyewear, travel, men, women, accessories',
      specifications: JSON.stringify({ UVProtection: 'UV400 100%', Frame: 'Beta Titanium', Weight: '14g' }),
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { size: 'Standard', color: 'Gunmetal Smoke', sku: 'SUN-GUN-STD', stock: 20 },
      ]
    },
    {
      name: 'Artisan Full-Grain Leather Minimalist Wallet',
      slug: 'artisan-leather-minimalist-wallet',
      brand: 'Heritage Leather',
      categorySlug: 'accessories',
      sellerId: seller1.id,
      price: 899,
      discountPercent: 20,
      isFeatured: false,
      description: 'Slim bifold RFID-blocking vegetable-tanned leather wallet with quick card ejector slot.',
      tags: 'wallet, leather, gift, accessories, men, birthday',
      specifications: JSON.stringify({ Material: 'Full Grain Cowhide', RFID: '13.56 MHz Blocking', Slots: '8 Cards + Cash' }),
      images: [
        'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { size: 'Compact', color: 'Cognac Brown', sku: 'WLT-COG-CMP', stock: 25 },
      ]
    },

    // BEAUTY
    {
      name: 'Lumière Hydrating Niacinamide Glow Serum',
      slug: 'lumiere-hydrating-glow-serum',
      brand: 'Lumière Botanical',
      categorySlug: 'beauty',
      sellerId: seller1.id,
      price: 799,
      discountPercent: 15,
      isFeatured: true,
      description: '10% Niacinamide + 2% Hyaluronic Acid formula to fade dark spots, refine pores, and restore skin luminosity.',
      tags: 'serum, skincare, beauty, glow, hydrating, face, grooming',
      specifications: JSON.stringify({ Volume: '30ml', SuitableFor: 'All Skin Types', Vegan: 'Cruelty Free' }),
      images: [
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { size: '30ml', color: 'Clear', sku: 'SRM-GLW-30', stock: 50 },
      ]
    },
    {
      name: 'Maison Noir Eau De Parfum Spray 100ml',
      slug: 'maison-noir-eau-de-parfum',
      brand: 'Maison Perfumes',
      categorySlug: 'beauty',
      sellerId: seller1.id,
      price: 2499,
      discountPercent: 20,
      isFeatured: true,
      description: 'Sensual wood and amber accords layered with bergamot, smoky oud, and vanilla bean notes.',
      tags: 'perfume, fragrance, beauty, gift, luxury, men, women',
      specifications: JSON.stringify({ Type: 'Eau de Parfum', Volume: '100ml', Notes: 'Oud, Bergamot, Amber' }),
      images: [
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { size: '100ml', color: 'Amber Glass', sku: 'EDP-NOI-100', stock: 30 },
      ]
    },

    // ELECTRONICS
    {
      name: 'SonicPro Wireless ANC Noise Cancelling Headphones',
      slug: 'sonicpro-wireless-anc-headphones',
      brand: 'CyberTech Sound',
      categorySlug: 'electronics',
      sellerId: seller2.id,
      price: 4999,
      discountPercent: 35,
      isFeatured: true,
      description: 'Industry-leading 45dB Active Noise Cancellation with 40mm Titanium drivers and 60-hour playtime.',
      tags: 'headphones, wireless, earbuds, noise cancelling, electronics, audio, music, bluetooth',
      specifications: JSON.stringify({ BatteryLife: '60 Hours', ANC: '45dB Hybrid ANC', Codecs: 'LDAC, AAC, SBC' }),
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { size: 'Over-Ear', color: 'Matte Onyx Black', sku: 'HPH-BLK-ONE', stock: 40 },
        { size: 'Over-Ear', color: 'Silver Birch', sku: 'HPH-SLV-ONE', stock: 25 },
      ]
    },
    {
      name: 'AeroBook Pro 15.6 M3 AI Ultra Laptop',
      slug: 'aerobook-pro-15-m3-ai-laptop',
      brand: 'CyberTech',
      categorySlug: 'electronics',
      sellerId: seller2.id,
      price: 64999,
      discountPercent: 12,
      isFeatured: true,
      description: 'Powered by 12-Core NPU for AI workflows, 16GB LPDDR5X RAM, 1TB NVMe SSD, and 3K OLED Display.',
      tags: 'laptop, laptop under 50000, electronics, computer, office, gaming, smart',
      specifications: JSON.stringify({ Processor: 'Intel Core Ultra 7', RAM: '16GB DDR5', Storage: '1TB SSD', Display: '3K 120Hz OLED' }),
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { size: '1TB SSD / 16GB', color: 'Space Grey', sku: 'LTP-GRY-1TB', stock: 10 },
      ]
    },
    {
      name: 'QuantumFit AMOLED Smartwatch & Fitness Tracker',
      slug: 'quantumfit-amoled-smartwatch',
      brand: 'CyberTech Fit',
      categorySlug: 'electronics',
      sellerId: seller2.id,
      price: 2999,
      discountPercent: 40,
      isFeatured: false,
      description: '1.43-inch Always-On Retina AMOLED display, Bluetooth calling, SpO2 sensor, and 100+ workout modes.',
      tags: 'smart watch, fitness, watch, electronics, bluetooth calling, gift',
      specifications: JSON.stringify({ Display: '1.43 AMOLED 1000 nits', Waterproof: 'IP68', Battery: '12 Days' }),
      images: [
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { size: '46mm', color: 'Midnight Black Strap', sku: 'SMW-BLK-46', stock: 35 },
      ]
    },
    {
      name: 'AirBuds Pro 3 True Wireless Stereo Earbuds',
      slug: 'airbuds-pro-3-tws-earbuds',
      brand: 'CyberTech Sound',
      categorySlug: 'electronics',
      sellerId: seller2.id,
      price: 1899,
      discountPercent: 50,
      isFeatured: true,
      description: 'Quad-mic ENC crystal clear calling, 13mm bass drivers, ultra low latency 40ms gaming mode.',
      tags: 'earbuds, wireless headphones, audio, electronics, music, bluetooth',
      specifications: JSON.stringify({ Playtime: '36 Hours Total', GamingLatency: '40ms', Resistance: 'IPX5 Sweatproof' }),
      images: [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { size: 'Compact Case', color: 'Glossy White', sku: 'EBD-WHT-PRO', stock: 60 },
      ]
    },

    // HOME & KITCHEN
    {
      name: 'Nordic Velvet Ergonomic Recliner Armchair',
      slug: 'nordic-velvet-ergonomic-recliner',
      brand: 'Casa Decor',
      categorySlug: 'home-kitchen',
      sellerId: seller1.id,
      price: 12999,
      discountPercent: 25,
      isFeatured: true,
      description: 'Plush stain-resistant velvet lounge chair with high-density foam padding and solid teakwood legs.',
      tags: 'furniture, chair, recliner, home, living room, decor',
      specifications: JSON.stringify({ Wood: 'Seasoned Teakwood', Fabric: 'Water-Repellent Velvet', Capacity: '150 kg' }),
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { size: 'Single Seater', color: 'Emerald Velvet', sku: 'CHR-EMR-SGL', stock: 6 },
      ]
    },
    {
      name: 'ChefPro Precision 12-Piece Ceramic Non-Stick Cookware Set',
      slug: 'chefpro-12-piece-ceramic-cookware-set',
      brand: 'Casa Kitchen',
      categorySlug: 'home-kitchen',
      sellerId: seller1.id,
      price: 4999,
      discountPercent: 30,
      isFeatured: false,
      description: 'Toxin-free non-stick ceramic induction cookware set with heat-resistant silicone handles.',
      tags: 'cookware, kitchen, appliances, pan, pot, home',
      specifications: JSON.stringify({ Coating: 'PFAS/PFOA Free Ceramic', InductionCompatible: 'Yes' }),
      images: [
        'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { size: '12-Piece Set', color: 'Terracotta Red', sku: 'CW-RED-12P', stock: 18 },
      ]
    },

    // GROCERY & DAILY
    {
      name: 'Organic Wildflower Raw Honey 500g',
      slug: 'organic-wildflower-raw-honey-500g',
      brand: 'Nature Harvest',
      categorySlug: 'grocery',
      sellerId: seller1.id,
      price: 449,
      discountPercent: 10,
      isFeatured: false,
      description: '100% unpasteurized raw forest wildflower honey harvested directly from sustainable beehives.',
      tags: 'honey, organic, grocery, food, healthy, daily needs',
      specifications: JSON.stringify({ Weight: '500g', Purity: 'Unfiltered 100% Raw', ShelfLife: '24 Months' }),
      images: [
        'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { size: '500g Jar', color: 'Golden Amber', sku: 'HNY-ORG-500', stock: 80 },
      ]
    },

    // SPORTS & FITNESS
    {
      name: 'FlexFit Pro Adjustable Cast Iron Dumbbell Set 20kg',
      slug: 'flexfit-pro-adjustable-dumbbell-set-20kg',
      brand: 'Apex Fitness',
      categorySlug: 'sports-fitness',
      sellerId: seller2.id,
      price: 2799,
      discountPercent: 20,
      isFeatured: true,
      description: 'Heavy duty rubberized cast iron weight plates with spin-lock star collars for home gym workouts.',
      tags: 'gym equipment, dumbbells, weights, fitness, sports, exercise',
      specifications: JSON.stringify({ TotalWeight: '20 kg', Material: 'Cast Iron Rubber Coated' }),
      images: [
        'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { size: '20kg Pair', color: 'Chrome & Black', sku: 'DMB-20K-SET', stock: 15 },
      ]
    },

    // BOOKS & EDUCATION
    {
      name: 'The Art of Masterful Living Hardcover',
      slug: 'the-art-of-masterful-living-hardcover',
      brand: 'StyleKart Publishing',
      categorySlug: 'books-education',
      sellerId: seller1.id,
      price: 599,
      discountPercent: 15,
      isFeatured: false,
      description: 'Bestselling guide on mindfulness, high productivity habits, and emotional resilience.',
      tags: 'books, book, education, reading, self-help, hardcover',
      specifications: JSON.stringify({ Pages: '340', Language: 'English', Publisher: 'StyleKart Press' }),
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { size: 'Hardcover', color: 'Midnight Navy', sku: 'BOK-ART-HC', stock: 45 },
      ]
    },

    // TOYS & BABY
    {
      name: 'RoboQuest STEM Interactive Programmable Bot',
      slug: 'roboquest-stem-interactive-bot',
      brand: 'TechToys',
      categorySlug: 'toys-baby',
      sellerId: seller2.id,
      price: 1999,
      discountPercent: 25,
      isFeatured: true,
      description: 'App-controlled educational coding robot with obstacle sensors, voice response, and LED matrix face.',
      tags: 'toys, stem, baby, kids, games, robot, educational',
      specifications: JSON.stringify({ AgeGroup: '8+ Years', Battery: 'Rechargeable Li-Ion', Connectivity: 'Bluetooth 5.0' }),
      images: [
        'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { size: 'Standard', color: 'Cyber Yellow', sku: 'TOY-ROB-YEL', stock: 25 },
      ]
    },

    // AUTOMOTIVE
    {
      name: 'TurboClean High-Power Wireless Car Vacuum Cleaner',
      slug: 'turboclean-wireless-car-vacuum',
      brand: 'AutoCare Pro',
      categorySlug: 'automotive',
      sellerId: seller2.id,
      price: 1499,
      discountPercent: 35,
      isFeatured: false,
      description: '120W 9000Pa brushless motor suction car vacuum with washable HEPA filter and LED light.',
      tags: 'automotive, car accessories, cleaning, vacuum, wireless',
      specifications: JSON.stringify({ Suction: '9000 Pa', Battery: '6000mAh Type-C Fast Charge' }),
      images: [
        'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { size: 'Handheld', color: 'Carbon Matte', sku: 'CAR-VAC-120', stock: 30 },
      ]
    },

    // PET SUPPLIES
    {
      name: 'Purrfect Care Deluxe Multi-Level Cat Tree Tower',
      slug: 'purrfect-care-deluxe-cat-tree-tower',
      brand: 'PetKingdom',
      categorySlug: 'pet-supplies',
      sellerId: seller1.id,
      price: 3299,
      discountPercent: 20,
      isFeatured: false,
      description: '54-inch heavy duty cat scratching post condo with plush hammocks and natural sisal rope columns.',
      tags: 'pet supplies, pet food, cat, dog, toys, grooming',
      specifications: JSON.stringify({ Height: '137 cm', Posts: '100% Natural Sisal Rope' }),
      images: [
        'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { size: '54 Inch', color: 'Warm Beige', sku: 'PET-CAT-54', stock: 12 },
      ]
    }
  ];

  for (const p of products) {
    const categoryId = categoryMap.get(p.categorySlug);
    if (!categoryId) continue;

    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        categoryId: categoryId,
        sellerId: p.sellerId,
        price: p.price,
        discountPercent: p.discountPercent,
        isFeatured: p.isFeatured,
        description: p.description,
        tags: p.tags,
        specifications: p.specifications,
      },
    });

    // Create images
    for (let i = 0; i < p.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: p.images[i],
          isPrimary: i === 0,
        },
      });
    }

    // Create variants
    for (const v of p.variants) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          size: v.size,
          color: v.color,
          sku: v.sku,
          price: Math.round(p.price * (1 - p.discountPercent / 100)),
          stock: v.stock,
          imageUrl: p.images[0],
        },
      });
    }

    // Create sample review
    await prisma.review.create({
      data: {
        productId: product.id,
        userId: customerUser.id,
        rating: 5,
        title: 'Outstanding quality and fast delivery!',
        comment: `Extremely satisfied with the build quality of ${p.name}. The item arrived nicely packaged and exceeded my expectations!`,
        isVerifiedPurchase: true,
      },
    });
  }

  // 5. Create Promo Coupons
  await prisma.coupon.createMany({
    data: [
      { code: 'STYLE10', discountPercent: 10, maxDiscount: 500, minSpend: 999, expiresAt: new Date('2027-12-31') },
      { code: 'WELCOME20', discountPercent: 20, maxDiscount: 1000, minSpend: 1999, expiresAt: new Date('2027-12-31') },
      { code: 'FESTIVE30', discountPercent: 30, maxDiscount: 2000, minSpend: 4999, expiresAt: new Date('2027-12-31') },
    ],
  });

  console.log('Database seeding complete successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
