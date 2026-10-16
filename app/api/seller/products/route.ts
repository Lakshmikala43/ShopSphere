import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const seller = await prisma.seller.findUnique({ where: { userId: user.userId } });
    if (!seller && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Seller profile not found' }, { status: 404 });
    }

    const products = await prisma.product.findMany({
      where: user.role === 'ADMIN' ? {} : { sellerId: seller?.id },
      include: {
        images: true,
        variants: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching seller products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized seller action' }, { status: 401 });
    }

    const seller = await prisma.seller.findUnique({ where: { userId: user.userId } });
    if (!seller && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Seller profile missing' }, { status: 404 });
    }

    const body = await req.json();
    const { name, brand, description, price, discountPercent = 0, categoryId, imageUrl, size, color, stock = 10, tags } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 });
    }

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        brand: brand || 'StyleKart Brand',
        description: description || 'High quality product on StyleKart AI',
        price: parseFloat(price),
        discountPercent: parseFloat(discountPercent),
        categoryId,
        sellerId: seller ? seller.id : (await prisma.seller.findFirst())!.id,
        tags: tags || `${name}, fashion, stylekart`,
        images: {
          create: [{ url: imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', isPrimary: true }],
        },
        variants: {
          create: [
            {
              size: size || 'M',
              color: color || 'Default',
              sku: `SKU-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
              price: parseFloat(price) * (1 - (parseFloat(discountPercent) || 0) / 100),
              stock: parseInt(stock, 10),
            },
          ],
        },
      },
    });

    return NextResponse.json({ product, message: 'Product created successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error creating product' }, { status: 500 });
  }
}
