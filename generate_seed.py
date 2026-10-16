import json

categories = [
    { "name": "Fashion", "slug": "fashion", "description": "Dresses for women & girls, ethnic suits, sarees, tops & fashion apparel under ₹1000", "image": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80" },
    { "name": "Footwear", "slug": "footwear", "description": "Sneakers, casual shoes, heels, sandals & slippers under ₹1000", "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80" },
    { "name": "Accessories", "slug": "accessories", "description": "Analog watches, wallets, sunglasses & belts under ₹1000", "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" },
    { "name": "Beauty", "slug": "beauty", "description": "Face washes, serums, lip balms & perfumes under ₹1000", "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80" },
    { "name": "Electronics", "slug": "electronics", "description": "Wireless earbuds, cables, smart bands & mouse under ₹1000", "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" },
    { "name": "Home & Kitchen", "slug": "home-kitchen", "description": "Mugs, cushions, decor & cookware utensils under ₹1000", "image": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80" },
    { "name": "Grocery & Daily", "slug": "grocery", "description": "Organic tea, dry fruits, snacks & beverages under ₹1000", "image": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80" },
    { "name": "Sports & Fitness", "slug": "sports-fitness", "description": "Yoga mats, resistance bands & gym gloves under ₹1000", "image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80" },
    { "name": "Books & Education", "slug": "books-education", "description": "Bestsellers, journals, pen sets & planners under ₹1000", "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80" },
    { "name": "Toys & Baby", "slug": "toys-baby", "description": "Plush teddy bears, board games & baby bibs under ₹1000", "image": "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80" },
    { "name": "Automotive", "slug": "automotive", "description": "Car air fresheners, phone holders & microfiber cloths under ₹1000", "image": "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80" },
    { "name": "Pet Supplies", "slug": "pet-supplies", "description": "Chew toys, pet food bowls & grooming brushes under ₹1000", "image": "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80" }
]

category_templates = {
    "fashion": {
        "brands": ["Aura Luxe", "Heritage Threads", "Vogue Couture", "Urban Grace", "ChicGirl", "Little Princess", "EcoThread", "SilkBoutique"],
        "adjectives": ["Floral Chiffon", "Embroidered Velvet", "A-Line Cotton", "Bodycon Ribbed", "Tiered Ruffle", "Boho Printed", "Georgette", "Satin Off-Shoulder", "Smocked Fit & Flare", "Silk Blend", "Denim Shirt", "Pleated Midi"],
        "items": [
            "Women's Maxi Dress",
            "Women's Anarkali Kurta Set",
            "Women's Bodycon Party Dress",
            "Women's Summer Sundress",
            "Women's Wrap Midi Dress",
            "Women's Georgette Saree",
            "Women's Velvet Party Gown",
            "Women's Chikankari Kurti",
            "Women's Cocktail Dress",
            "Women's Shirred Flare Dress",
            "Girls Printed Cotton Frock",
            "Girls Princess Party Gown",
            "Girls Tiered Summer Sundress",
            "Girls Ethnic Lehenga Choli Set",
            "Girls Velvet Festival Dress",
            "Girls Denim Pinafore Dress",
            "Girls Sleeveless A-Line Dress",
            "Girls Ribbed Knit Sweater Dress"
        ],
        "prices": [299, 399, 499, 599, 699, 799, 899, 949, 999],
        "images": [
            "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "footwear": {
        "brands": ["Veloce", "AeroStep", "StridePro", "UrbanSole", "FlexWalk", "ComfortFoot"],
        "adjectives": ["Lightweight", "Breathable", "Canvas", "Casual Slip-On", "Anti-Skid", "Soft Sole", "Flexible", "Sporty"],
        "items": ["Canvas Sneakers", "Running Shoes", "Casual Loafers", "Slippers", "Flip Flops", "Walking Sandals", "Clogs", "Gym Shoes"],
        "prices": [249, 349, 449, 549, 649, 749, 849, 949, 999],
        "images": [
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "accessories": {
        "brands": ["Chronos", "Spectra", "Artisan", "UrbanGlow", "StyleCraft"],
        "adjectives": ["Minimalist", "Polarized", "Genuine Leather", "Analog Quartz", "RFID Blocking", "UV400 Protected", "Slim"],
        "items": ["Quartz Wristwatch", "Polarized Sunglasses", "Bifold Wallet", "Leather Belt", "Canvas Tote Bag", "Baseball Cap", "Keychain Combo"],
        "prices": [149, 249, 399, 499, 699, 799, 899, 999],
        "images": [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "beauty": {
        "brands": ["Lumiere Botanicals", "DermaPure", "GlowEssence", "AromaLux"],
        "adjectives": ["Hydrating", "Organic", "Vitamin C", "Matte Finish", "Aloe Vera", "Niacinamide"],
        "items": ["Face Wash Gel", "Moisturizing Cream", "Glow Serum 30ml", "Lip Balm Pack", "Eau De Toilette 50ml", "Sunscreen Lotion SPF50"],
        "prices": [99, 149, 249, 349, 499, 599, 799, 899],
        "images": [
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "electronics": {
        "brands": ["CyberTech", "SonicSound", "PowerMax", "NanoGear"],
        "adjectives": ["Wireless TWS", "Fast Charging", "Ergonomic", "Bluetooth 5.3", "Braided Nylon"],
        "items": ["TWS Earbuds", "10000mAh Power Bank", "Bluetooth Speaker", "Braided Type-C Cable", "Wireless Gaming Mouse", "Smart Fitness Band"],
        "prices": [199, 299, 399, 499, 699, 799, 899, 999],
        "images": [
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "home-kitchen": {
        "brands": ["Casa Decor", "KitchenChef", "HomeNest"],
        "adjectives": ["Stainless Steel", "Ceramic", "Printed Cotton", "Non-Stick"],
        "items": ["Ceramic Coffee Mug", "Cotton Cushion Cover", "Non-Stick Frying Pan 24cm", "Stainless Steel Water Bottle 1L", "Wall Hanging Decor"],
        "prices": [149, 249, 349, 499, 599, 699, 899, 999],
        "images": [
            "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "grocery": {
        "brands": ["Nature Harvest", "Organic Delight", "FreshBites"],
        "adjectives": ["100% Organic", "Raw Natural", "Roasted", "Gluten-Free"],
        "items": ["Wildflower Raw Honey 250g", "Green Tea Bags 50s", "Roasted Almonds 250g", "Organic Oats 1kg", "Dark Chocolate Bar 100g"],
        "prices": [99, 149, 249, 349, 449, 549, 699, 899],
        "images": [
            "https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "sports-fitness": {
        "brands": ["Apex Fitness", "FlexFit", "ProAthletics"],
        "adjectives": ["Non-Slip", "Heavy Duty", "Adjustable", "High Density"],
        "items": ["Yoga Mat 6mm", "Resistance Band Set", "Skipping Rope with Counter", "Gym Gloves Pair", "Sipper Shaker Bottle 750ml"],
        "prices": [199, 299, 399, 499, 599, 699, 799, 899, 999],
        "images": [
            "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "books-education": {
        "brands": ["StyleKart Press", "MindCraft"],
        "adjectives": ["Hardcover", "Bestselling", "A5 Ruled", "Mindfulness"],
        "items": ["Productivity Journal", "Hardcover Notebook", "Calligraphy Pen Set", "Self-Help Bestseller Book", "Academic Planner 2026"],
        "prices": [99, 149, 249, 349, 449, 599, 799],
        "images": [
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "toys-baby": {
        "brands": ["TechToys", "BabyJoy", "LittleWorld"],
        "adjectives": ["Non-Toxic", "Soft Plush", "Educational", "Interactive"],
        "items": ["Plush Teddy Bear 30cm", "Wooden Puzzle Board", "Baby Silicone Teether", "Board Game Pack", "Building Blocks Set"],
        "prices": [149, 249, 349, 449, 599, 699, 899, 999],
        "images": [
            "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "automotive": {
        "brands": ["AutoCare Pro", "TurboClean"],
        "adjectives": ["High Power", "Washable", "360 Rotation", "Compact"],
        "items": ["Car Air Freshener Gel", "Microfiber Cleaning Cloth 4-Pack", "Dashboard Phone Mount", "Blind Spot Mirror Pair"],
        "prices": [99, 199, 299, 399, 499, 699, 899, 999],
        "images": [
            "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "pet-supplies": {
        "brands": ["PetKingdom", "Purrfect Care"],
        "adjectives": ["Durable", "Chew Resistant", "Stainless Steel", "Gentle"],
        "items": ["Dog Chew Toy Ball", "Cat Feather Wand", "Pet Food Bowl 500ml", "Deshedding Grooming Glove"],
        "prices": [149, 249, 349, 449, 599, 699, 799, 899],
        "images": [
            "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80"
        ]
    }
}

seed_code = """const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding 1,500+ products including all kinds of dresses for women & girls under ₹1,000...');

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

  const passwordHash = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@stylekart.com',
      passwordHash,
      name: 'StyleKart Admin',
      phone: '+91 98765 43210',
      role: 'ADMIN',
    },
  });

  const sellerUser1 = await prisma.user.create({
    data: {
      email: 'seller@stylekart.com',
      passwordHash,
      name: 'Aura Fashion & Trends',
      phone: '+91 98111 22233',
      role: 'SELLER',
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      email: 'customer@stylekart.com',
      passwordHash,
      name: 'Priya Sharma',
      phone: '+91 98999 88877',
      role: 'CUSTOMER',
    },
  });

  await prisma.address.create({
    data: {
      userId: customerUser.id,
      fullName: 'Priya Sharma',
      phone: '+91 98999 88877',
      line1: 'Flat 402, Green Glen Layout',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560103',
      country: 'India',
      isDefault: true,
    },
  });

  const seller1 = await prisma.seller.create({
    data: {
      userId: sellerUser1.id,
      storeName: 'Aura Fashion Hub & Dress Studio',
      storeDescription: 'Premier boutique for women and girls dresses, traditional kurtas, gowns, and western wear under ₹1,000.',
      rating: 4.9,
      isApproved: true,
    },
  });

"""

seed_code += "  const categoriesData = " + json.dumps(categories, indent=2) + ";\n\n"
seed_code += """  const categoryMap = new Map();
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categoryMap.set(cat.slug, created.id);
  }

  let totalProductsCount = 0;
"""

# Generate 250 fashion products (dresses focus) + 100 for other categories
for cat in categories:
    slug = cat["slug"]
    tmpl = category_templates[slug]
    count = 250 if slug == "fashion" else 100

    seed_code += f"  // Category: {slug}\n"
    seed_code += f"  const catId_{slug.replace('-', '_')} = categoryMap.get('{slug}');\n"

    for i in range(1, count + 1):
        brand = tmpl["brands"][i % len(tmpl["brands"])]
        adj = tmpl["adjectives"][i % len(tmpl["adjectives"])]
        item = tmpl["items"][i % len(tmpl["items"])]
        price = tmpl["prices"][i % len(tmpl["prices"])]
        img = tmpl["images"][i % len(tmpl["images"])]
        disc = (i * 5) % 35

        name = f"{brand} {adj} {item} #{i}"
        prod_slug = f"{slug}-{i}-{name.lower().replace(' ', '-').replace('#', '').replace('/', '').replace('&', 'and')}"

        sizes_list = ["S", "M", "L", "XL"] if "Dress" in item or "Kurta" in item or "Frock" in item or "Gown" in item else ["Standard"]
        colors_list = ["Rose Pink", "Crimson Red", "Emerald Green", "Midnight Navy", "Floral Print", "Pastel Yellow", "Pure White", "Black"]
        color_chosen = colors_list[i % len(colors_list)]

        seed_code += f"""  const p_{slug.replace('-', '_')}_{i} = await prisma.product.create({{
    data: {{
      name: "{name}",
      slug: "{prod_slug}",
      brand: "{brand}",
      categoryId: catId_{slug.replace('-', '_')},
      sellerId: seller1.id,
      price: {price},
      discountPercent: {disc},
      isFeatured: {str(i <= 12).lower()},
      description: "Elegant {item.lower()} featuring {adj.lower()} design and soft breathable fabric. Tailored for girls and women, priced under ₹1,000.",
      tags: "dress, dresses for girls, dresses for women, {item.lower()}, {slug}, women fashion, ethnic, party wear, {color_chosen.lower()}",
      images: {{ create: [{{ url: "{img}", isPrimary: true }}] }},
      variants: {{ create: [{{ size: "{sizes_list[i % len(sizes_list)]}", color: "{color_chosen}", sku: "SKU-{slug}-{i}", price: {price}, stock: 30 }}] }},
    }}
  }});
  totalProductsCount++;
"""

seed_code += """
  // Create Promo Coupons
  await prisma.coupon.createMany({
    data: [
      { code: 'STYLE10', discountPercent: 10, maxDiscount: 500, minSpend: 499, expiresAt: new Date('2027-12-31') },
      { code: 'WELCOME20', discountPercent: 20, maxDiscount: 1000, minSpend: 999, expiresAt: new Date('2027-12-31') },
    ],
  });

  console.log(`Successfully seeded ${totalProductsCount} catalog items (including 250+ dresses for girls & women under ₹1,000)!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
"""

with open("prisma/seed.js", "w", encoding="utf-8") as f:
    f.write(seed_code)

print("Generated prisma/seed.js with women's and girls' dresses under ₹1,000!")
