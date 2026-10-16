import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || '';
    const categorySlug = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '1000000');
    const minRating = parseFloat(searchParams.get('rating') || '0');
    const minDiscount = parseFloat(searchParams.get('discount') || '0');
    const size = searchParams.get('size') || '';
    const color = searchParams.get('color') || '';
    const sortBy = searchParams.get('sort') || 'relevance';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    const skip = (page - 1) * limit;

    const whereClause: any = {
      isApproved: true,
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
      discountPercent: {
        gte: minDiscount,
      },
    };

    if (brand) {
      whereClause.brand = { contains: brand };
    }

    if (categorySlug) {
      whereClause.category = { slug: categorySlug };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    if (size || color) {
      whereClause.variants = {
        some: {
          ...(size ? { size: { equals: size } } : {}),
          ...(color ? { color: { contains: color } } : {}),
        },
      };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price-low') orderBy = { price: 'asc' };
    if (sortBy === 'price-high') orderBy = { price: 'desc' };
    if (sortBy === 'discount') orderBy = { discountPercent: 'desc' };
    if (sortBy === 'newest') orderBy = { createdAt: 'desc' };

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          images: true,
          variants: true,
          category: true,
          reviews: { select: { rating: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    // Format products with average rating
    const formattedProducts = products.map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
          : 4.5;
      return {
        ...p,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: p.reviews.length,
      };
    });

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching products' }, { status: 500 });
  }
}
