import json

categories = [
    { "name": "Fashion", "slug": "fashion", "description": "200+ Unique dresses for girls & women, sarees, tops & fashion apparel under ₹1000", "image": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80" },
    { "name": "Footwear", "slug": "footwear", "description": "200+ Unique sneakers, casual shoes, heels & sandals under ₹1000", "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80" },
    { "name": "Accessories", "slug": "accessories", "description": "200+ Unique watches, sunglasses, wallets & bags under ₹1000", "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" },
    { "name": "Beauty", "slug": "beauty", "description": "200+ Unique skincare, serums, lip care & fragrances under ₹1000", "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80" },
    { "name": "Electronics", "slug": "electronics", "description": "200+ Unique TWS earbuds, cables, smart bands & tech gadgets under ₹1000", "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" },
    { "name": "Home & Kitchen", "slug": "home-kitchen", "description": "200+ Unique ceramic mugs, cushions, cookware & decor under ₹1000", "image": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80" },
    { "name": "Grocery & Daily", "slug": "grocery", "description": "200+ Unique organic teas, dry fruits, chocolates & snacks under ₹1000", "image": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80" },
    { "name": "Sports & Fitness", "slug": "sports-fitness", "description": "200+ Unique yoga mats, gym gear, resistance bands & bottles under ₹1000", "image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80" },
    { "name": "Books & Education", "slug": "books-education", "description": "200+ Unique journals, bestseller novels, pen sets & planners under ₹1000", "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80" },
    { "name": "Toys & Baby", "slug": "toys-baby", "description": "200+ Unique plush toys, board games & baby care items under ₹1000", "image": "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80" },
    { "name": "Automotive", "slug": "automotive", "description": "200+ Unique car accessories, air fresheners & phone mounts under ₹1000", "image": "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80" },
    { "name": "Pet Supplies", "slug": "pet-supplies", "description": "200+ Unique pet toys, bowls, leashes & treats under ₹1000", "image": "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80" }
]

category_data_pools = {
    "fashion": {
        "brands": ["Aura Luxe", "Heritage Threads", "Vogue Couture", "Urban Grace", "ChicGirl", "Little Princess", "EcoThread", "SilkBoutique", "VelvetCraft", "CottonStory", "RoyalKanya", "BellaFemme"],
        "adjectives": ["Floral Chiffon", "Embroidered Velvet", "A-Line Cotton", "Bodycon Ribbed", "Tiered Ruffle", "Boho Printed", "Georgette", "Satin Off-Shoulder", "Smocked Fit & Flare", "Silk Blend", "Denim Pinafore", "Pleated Midi", "Chikankari", "Pastel Rayon", "Organza Tiered", "Lace Sleeve", "Wrinkle-Free Viscose", "Polka Dot", "Vintage Flared", "Wrap Front"],
        "items": [
            "Women's Maxi Dress", "Women's Anarkali Kurta Set", "Women's Bodycon Party Dress", "Women's Summer Sundress", "Women's Wrap Midi Dress", "Women's Georgette Saree", "Women's Velvet Party Gown", "Women's Chikankari Kurti", "Women's Cocktail Dress", "Women's Shirred Flare Dress", "Women's Tiered Ruffle Dress", "Women's Silk Blend Dupatta Set", "Women's Denim Shirt Dress", "Women's Off-Shoulder Gown",
            "Girls Printed Cotton Frock", "Girls Princess Party Gown", "Girls Tiered Summer Sundress", "Girls Ethnic Lehenga Choli Set", "Girls Velvet Festival Dress", "Girls Denim Pinafore Dress", "Girls Sleeveless A-Line Dress", "Girls Ribbed Knit Sweater Dress", "Girls Floral Beach Dress", "Girls Polka Dot Skirt Dress"
        ],
        "images": [
            "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "footwear": {
        "brands": ["Veloce", "AeroStep", "StridePro", "UrbanSole", "FlexWalk", "ComfortFoot", "SneakerHead", "RoyalStep"],
        "adjectives": ["Lightweight", "Breathable Mesh", "Canvas Retro", "Casual Slip-On", "Anti-Skid Rubber", "Soft Cushioned", "Flexible FlyKnit", "Sporty High-Top", "Memory Foam", "Waterproof Rubber", "Ergonomic Sole"],
        "items": ["Canvas Sneakers", "Running Shoes", "Casual Loafers", "Slippers", "Flip Flops", "Walking Sandals", "Clogs", "Gym Shoes", "Ethic Mojari", "Block Heel Sandals", "Flat Strappy Sandals"],
        "images": [
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "accessories": {
        "brands": ["Chronos", "Spectra", "Artisan Leather", "UrbanGlow", "StyleCraft", "LuxeBelt", "AeroShades"],
        "adjectives": ["Minimalist Analog", "Polarized Aviator", "Genuine Cowhide Leather", "Quartz Movement", "RFID Blocking", "UV400 Anti-Glare", "Slim Bifold", "Casual Canvas", "Embroidered Silk"],
        "items": ["Quartz Wristwatch", "Polarized Sunglasses", "Bifold Wallet", "Leather Belt", "Canvas Tote Bag", "Baseball Cap", "Keychain Combo Set", "Card Holder Wallet", "Travel Duffel Bag", "Silk Scarf"],
        "images": [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "beauty": {
        "brands": ["Lumiere Botanicals", "DermaPure", "GlowEssence", "AromaLux", "Naturals Co", "PureSkin"],
        "adjectives": ["Hydrating 10%", "Organic Botanical", "Vitamin C Brightening", "Matte Touch", "Aloe Vera Cooling", "Niacinamide Pore Refining", "Charcoal Detox", "Rosewater Distilled"],
        "items": ["Face Wash Gel 100ml", "Moisturizing Day Cream", "Glow Serum 30ml", "Lip Balm 3-Pack", "Eau De Toilette Spray 50ml", "Sunscreen Lotion SPF50", "Argan Oil Hair Serum", "Exfoliating Body Scrub"],
        "images": [
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "electronics": {
        "brands": ["CyberTech", "SonicSound", "PowerMax", "NanoGear", "AeroTech", "VoltGear"],
        "adjectives": ["Wireless TWS 5.3", "Fast Charging 22.5W", "Ergonomic Silent", "Bluetooth ANC", "Braided Nylon Cable", "HD Deep Bass", "Ultra Slim Metallic", "RGB Backlit"],
        "items": ["TWS Stereo Earbuds", "10000mAh Power Bank", "Portable Bluetooth Speaker", "Type-C Fast Charging Cable", "Wireless Optical Mouse", "Smart Fitness Band Tracker", "Noise Reduction Headset"],
        "images": [
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "home-kitchen": {
        "brands": ["Casa Decor", "KitchenChef", "HomeNest", "UrbanLiving", "ArtisanHome"],
        "adjectives": ["Stainless Steel 304", "Ceramic Hand-Painted", "Printed Cotton 100%", "Granite Non-Stick", "Aesthetic Nordic", "Vacuum Insulated"],
        "items": ["Ceramic Coffee Mug 350ml", "Cotton Cushion Cover 16x16", "Non-Stick Frying Pan 24cm", "Insulated Water Bottle 1L", "Boho Wall Hanging Decor", "Glass Storage Jar 3-Pack", "Warm LED Desk Lamp"],
        "images": [
            "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "grocery": {
        "brands": ["Nature Harvest", "Organic Delight", "FreshBites", "GreenFarm", "PureRoots"],
        "adjectives": ["100% Unfiltered Organic", "Raw Natural Forest", "Slow Roasted Salted", "Gluten-Free Fiber Rich", "Single Origin Artisan", "Zero Sugar Added"],
        "items": ["Wildflower Raw Honey 250g", "Green Tea Bags 50s Pack", "Roasted California Almonds 200g", "Rolled Oats 1kg", "Dark Chocolate Bar 70% 100g", "Mixed Berry Trail Mix 250g"],
        "images": [
            "https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "sports-fitness": {
        "brands": ["Apex Fitness", "FlexFit", "ProAthletics", "GymMax", "IronGear"],
        "adjectives": ["Non-Slip Textured 6mm", "Heavy Duty Latex", "Adjustable Length", "High Density Foam", "Sweatproof Padded"],
        "items": ["Yoga Mat 6mm with Strap", "Resistance Loop Band Set", "Skipping Rope with Counter", "Gym Workout Gloves Pair", "Protein Shaker Bottle 750ml", "Adjustable Hand Gripper"],
        "images": [
            "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "books-education": {
        "brands": ["StyleKart Press", "MindCraft", "ScholarPublishing", "PaperArt"],
        "adjectives": ["Hardcover Leatherette", "Bestselling Self-Help", "A5 Ruled 200 Pages", "Mindfulness Guided", "Fine Nib Calligraphy"],
        "items": ["Daily Productivity Planner", "Hardcover Bullet Journal", "Calligraphy Fountain Pen Set", "Self-Help Bestseller Book", "Academic Desk Calendar 2026", "Clip-On Book Reading Light"],
        "images": [
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "toys-baby": {
        "brands": ["TechToys", "BabyJoy", "LittleWorld", "PlayFun", "KiddoCraft"],
        "adjectives": ["Non-Toxic Washable", "Ultra Soft Plush 30cm", "Montessori Educational", "Interactive Battery-Operated", "BPA-Free Food Grade"],
        "items": ["Plush Teddy Bear Toy", "Wooden Animal Puzzle Board", "Silicone Teething Toy", "Family Board Game Set", "Colorful Building Blocks Kit", "Mini Pull-Back Car Pack"],
        "images": [
            "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "automotive": {
        "brands": ["AutoCare Pro", "TurboClean", "DriveStyle", "MotorMax"],
        "adjectives": ["High Suction Power", "Microfiber 800 GSM", "360 Rotation Magnetic", "Ultra Compact Leakproof"],
        "items": ["Car Air Freshener Gel 200g", "Microfiber Car Cleaning Cloth 4-Pack", "Dashboard Phone Mount Holder", "Convex Blind Spot Mirror Pair", "Backseat Organizer Pouch"],
        "images": [
            "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "pet-supplies": {
        "brands": ["PetKingdom", "Purrfect Care", "Pawsome", "FurBaby"],
        "adjectives": ["Durable Rubber", "Feather Interactive", "Stainless Steel Anti-Skid", "Gentle Silicone Bristle", "Crunchy Oven-Baked"],
        "items": ["Dog Squeaky Ball Toy", "Cat Feather Teaser Wand", "Pet Food Bowl 500ml", "Deshedding Grooming Glove", "Adjustable Nylon Dog Harness", "Oven-Baked Dog Treats 500g"],
        "images": [
            "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80"
        ]
    }
}

seed_code = """const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding 2,400+ 100% UNIQUE products (200 unique products in EACH section, ALL UNDER ₹1,000)...');

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
      name: 'Aura Fashion & Mega Store',
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
      storeName: 'StyleKart Official Superstore',
      storeDescription: 'Premier store offering 2,400+ unique products across all categories priced strictly under ₹1,000.',
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

# Prices array strictly below ₹1,000
price_tiers = [149, 199, 249, 299, 349, 399, 449, 499, 549, 599, 649, 699, 749, 799, 849, 899, 949, 999]

# Generate exactly 200 unique products for EACH of the 12 categories = 2,400 products
for cat in categories:
    slug = cat["slug"]
    tmpl = category_data_pools[slug]

    seed_code += f"  // Category: {slug} (200 Unique Items)\n"
    seed_code += f"  const catId_{slug.replace('-', '_')} = categoryMap.get('{slug}');\n"

    for i in range(1, 201):
        brand = tmpl["brands"][i % len(tmpl["brands"])]
        adj = tmpl["adjectives"][i % len(tmpl["adjectives"])]
        item = tmpl["items"][i % len(tmpl["items"])]
        price = price_tiers[(i * 7) % len(price_tiers)]
        img = tmpl["images"][i % len(tmpl["images"])]
        disc = (i * 3) % 35

        # Unique product name using unique index
        name = f"{brand} Edition #{i} {adj} {item}"
        prod_slug = f"{slug}-{i}-unique-{brand.lower()}-{item.lower().replace(' ', '-').replace('/', '').replace('#', '')}"

        sizes_list = ["S", "M", "L", "XL"] if "Dress" in item or "Kurta" in item or "Shirt" in item else ["Standard"]
        colors_list = ["Rose Pink", "Crimson Red", "Emerald Green", "Midnight Navy", "Pure White", "Matte Black", "Sky Blue", "Pastel Yellow", "Charcoal Grey"]
        color_chosen = colors_list[i % len(colors_list)]

        seed_code += f"""  await prisma.product.create({{
    data: {{
      name: "{name}",
      slug: "{prod_slug}",
      brand: "{brand}",
      categoryId: catId_{slug.replace('-', '_')},
      sellerId: seller1.id,
      price: {price},
      discountPercent: {disc},
      isFeatured: {str(i <= 10).lower()},
      description: "Unique {item.lower()} from {brand} with premium {adj.lower()} quality. 100% authentic item priced under ₹1,000.",
      tags: "{item.lower()}, {slug}, unique, budget, under 1000, {brand.lower()}, {color_chosen.lower()}",
      images: {{ create: [{{ url: "{img}", isPrimary: true }}] }},
      variants: {{ create: [{{ size: "{sizes_list[i % len(sizes_list)]}", color: "{color_chosen}", sku: "SKU-{slug}-{i}", price: {price}, stock: 25 }}] }},
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

  console.log(`Successfully seeded ${totalProductsCount} 100% UNIQUE products (200 in EACH category, ALL UNDER ₹1,000)!`);
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

# Safe console print without unicode
print("Generated prisma/seed.js with 2,400 100% unique products (200 per section under 1000 RS) successfully!")
