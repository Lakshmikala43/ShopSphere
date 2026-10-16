import { prisma } from '../prisma';

export async function getPersonalizedRecommendations(userId?: string, limit: number = 6) {
  // If user is logged in, find recent view events
  if (userId) {
    const lastEvent = await prisma.userEvent.findFirst({
      where: { userId, eventType: 'VIEW' },
      orderBy: { createdAt: 'desc' },
      include: { product: true },
    });

    if (lastEvent && lastEvent.product) {
      // Find similar products in same category
      const categoryProducts = await prisma.product.findMany({
        where: {
          categoryId: lastEvent.product.categoryId,
          id: { not: lastEvent.product.id },
          isApproved: true,
        },
        include: { images: true, variants: true, category: true },
        take: limit,
      });

      if (categoryProducts.length > 0) {
        return {
          title: `Because you viewed ${lastEvent.product.name}`,
          products: categoryProducts,
        };
      }
    }
  }

  // Fallback to Featured & Trending products
  const featured = await prisma.product.findMany({
    where: { isFeatured: true, isApproved: true },
    include: { images: true, variants: true, category: true },
    take: limit,
  });

  return {
    title: 'Trending & Recommended For You',
    products: featured,
  };
}

export async function getSimilarProducts(productId: string, limit: number = 4) {
  const currentProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!currentProduct) return [];

  return await prisma.product.findMany({
    where: {
      categoryId: currentProduct.categoryId,
      id: { not: productId },
      isApproved: true,
    },
    include: { images: true, variants: true, category: true },
    take: limit,
  });
}
