import { prisma } from '../prisma';

export interface StylistRequest {
  occasion: string; // College, Office, Wedding, Party, Casual, Date, Travel, Festival, Sports
  style: string;    // Casual, Formal, Streetwear, Traditional, Minimal, Trendy, Luxury
  budget: number;   // e.g. 5000
  colorPreference?: string;
  sizePreference?: string;
  categoryPreference?: string; // Men, Women, All
  freeText?: string;
}

export interface OutfitRecommendation {
  outfitTitle: string;
  totalCost: number;
  remainingBudget: number;
  explanation: string;
  items: Array<{
    categoryRole: 'Topwear' | 'Bottomwear' | 'Footwear' | 'Accessories';
    productId: string;
    variantId?: string;
    name: string;
    brand: string;
    price: number;
    image: string;
    reason: string;
  }>;
}

export async function generateAIFashionStylistOutfit(request: StylistRequest): Promise<OutfitRecommendation> {
  const { occasion, style, budget, colorPreference = '', categoryPreference = 'All' } = request;

  // Query real catalog products from DB
  const catalogProducts = await prisma.product.findMany({
    include: {
      images: true,
      variants: true,
      category: true,
    },
    where: {
      isApproved: true,
    },
  });

  if (!catalogProducts || catalogProducts.length === 0) {
    throw new Error('No products available in database catalog');
  }

  // Helper filter by tags/category/description
  const filterByKeywords = (keywords: string[]) => {
    return catalogProducts.filter((p) => {
      const text = `${p.name} ${p.description} ${p.tags} ${p.brand} ${p.category.name}`.toLowerCase();
      return keywords.some((kw) => text.includes(kw.toLowerCase()));
    });
  };

  // Select Topwear/Dress
  let tops = filterByKeywords([occasion, style, 'shirt', 'kurta', 'dress', 'hoodie', 'top', 'fashion']);
  if (tops.length === 0) tops = catalogProducts.filter((p) => p.category.slug === 'fashion');
  
  // Select Footwear
  let footwear = filterByKeywords(['shoes', 'sneakers', 'oxfords', 'running', 'boots', 'footwear']);
  if (footwear.length === 0) footwear = catalogProducts.filter((p) => p.category.slug === 'footwear');

  // Select Bottomwear (if top is not a full dress/anarkali)
  let bottoms = filterByKeywords(['trousers', 'pants', 'jeans', 'bottom']);
  if (bottoms.length === 0) bottoms = catalogProducts.filter((p) => p.category.slug === 'fashion');

  // Select Accessories
  let accessories = filterByKeywords(['watch', 'sunglasses', 'wallet', 'accessories']);
  if (accessories.length === 0) accessories = catalogProducts.filter((p) => p.category.slug === 'accessories');

  // Pick top product within budget slice (~40% of budget)
  const selectedTop = tops.find((p) => p.price <= budget * 0.5) || tops[0];
  let remaining = budget - (selectedTop ? selectedTop.price : 0);

  // Check if top is a full length dress or kurta set
  const isFullOutfit = selectedTop && (selectedTop.name.toLowerCase().includes('dress') || selectedTop.name.toLowerCase().includes('set'));

  let selectedBottom = null;
  if (!isFullOutfit) {
    selectedBottom = bottoms.find((p) => p.id !== selectedTop?.id && p.price <= remaining * 0.5) || bottoms[0];
    if (selectedBottom) remaining -= selectedBottom.price;
  }

  const selectedFootwear = footwear.find((p) => p.price <= remaining) || footwear[0];
  if (selectedFootwear) remaining -= selectedFootwear.price;

  const selectedAccessory = accessories.find((p) => p.price <= remaining) || accessories[0];
  if (selectedAccessory) remaining -= selectedAccessory.price;

  const outfitItems = [];

  if (selectedTop) {
    const primaryImg = selectedTop.images.find((i) => i.isPrimary)?.url || selectedTop.images[0]?.url || '';
    const variant = selectedTop.variants[0];
    outfitItems.push({
      categoryRole: 'Topwear' as const,
      productId: selectedTop.id,
      variantId: variant?.id,
      name: selectedTop.name,
      brand: selectedTop.brand,
      price: selectedTop.price,
      image: primaryImg,
      reason: `Matches your preferred ${style} vibe and ${occasion} theme perfectly.`,
    });
  }

  if (selectedBottom && !isFullOutfit) {
    const primaryImg = selectedBottom.images.find((i) => i.isPrimary)?.url || selectedBottom.images[0]?.url || '';
    const variant = selectedBottom.variants[0];
    outfitItems.push({
      categoryRole: 'Bottomwear' as const,
      productId: selectedBottom.id,
      variantId: variant?.id,
      name: selectedBottom.name,
      brand: selectedBottom.brand,
      price: selectedBottom.price,
      image: primaryImg,
      reason: `Complements the silhouette and color palette of your main outfit.`,
    });
  }

  if (selectedFootwear) {
    const primaryImg = selectedFootwear.images.find((i) => i.isPrimary)?.url || selectedFootwear.images[0]?.url || '';
    const variant = selectedFootwear.variants[0];
    outfitItems.push({
      categoryRole: 'Footwear' as const,
      productId: selectedFootwear.id,
      variantId: variant?.id,
      name: selectedFootwear.name,
      brand: selectedFootwear.brand,
      price: selectedFootwear.price,
      image: primaryImg,
      reason: `Provides ultimate comfort and elevates the ${style} aesthetic.`,
    });
  }

  if (selectedAccessory) {
    const primaryImg = selectedAccessory.images.find((i) => i.isPrimary)?.url || selectedAccessory.images[0]?.url || '';
    const variant = selectedAccessory.variants[0];
    outfitItems.push({
      categoryRole: 'Accessories' as const,
      productId: selectedAccessory.id,
      variantId: variant?.id,
      name: selectedAccessory.name,
      brand: selectedAccessory.brand,
      price: selectedAccessory.price,
      image: primaryImg,
      reason: `The ideal finishing touch to tie the whole ensemble together.`,
    });
  }

  const totalCost = outfitItems.reduce((acc, item) => acc + item.price, 0);

  return {
    outfitTitle: `Curated ${style} Ensemble for ${occasion}`,
    totalCost,
    remainingBudget: Math.max(0, budget - totalCost),
    explanation: `Our AI Stylist generated this cohesive look specifically for your ${occasion} occasion in a ${style} style, staying within your ₹${budget} budget.`,
    items: outfitItems,
  };
}
