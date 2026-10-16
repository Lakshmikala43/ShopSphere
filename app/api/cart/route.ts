import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ cartItems: [], summary: { subtotal: 0, discount: 0, shipping: 0, tax: 0, total: 0 } });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.userId },
      include: {
        product: {
          include: { images: true, category: true },
        },
        variant: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    let subtotal = 0;
    let originalTotal = 0;

    const formattedItems = cartItems.map((item) => {
      const unitPrice = item.variant ? item.variant.price : item.product.price;
      const originalPrice = item.product.price;
      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;
      originalTotal += originalPrice * item.quantity;

      const primaryImg = item.product.images.find((i) => i.isPrimary)?.url || item.product.images[0]?.url;

      return {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        name: item.product.name,
        brand: item.product.brand,
        image: item.variant?.imageUrl || primaryImg,
        size: item.variant?.size || 'Standard',
        color: item.variant?.color || 'Default',
        price: unitPrice,
        originalPrice: originalPrice,
        discountPercent: item.product.discountPercent,
        stock: item.variant ? item.variant.stock : 20,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      };
    });

    const discount = Math.max(0, originalTotal - subtotal);
    const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
    const tax = Math.round(subtotal * 0.05); // 5% GST tax
    const total = subtotal + shipping + tax;

    return NextResponse.json({
      cartItems: formattedItems,
      summary: {
        subtotal,
        discount,
        shipping,
        tax,
        total,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching cart' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Please log in to add items to cart' }, { status: 401 });
    }

    const { productId, variantId, quantity = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check variant stock
    let targetVariantId = variantId;
    if (!targetVariantId && product.variants.length > 0) {
      targetVariantId = product.variants[0].id;
    }

    if (targetVariantId) {
      const variant = product.variants.find((v) => v.id === targetVariantId);
      if (!variant || variant.stock < quantity) {
        return NextResponse.json({ error: 'Selected variant is out of stock' }, { status: 400 });
      }
    }

    // Check existing item in user cart
    const existing = await prisma.cartItem.findFirst({
      where: {
        userId: user.userId,
        productId,
        variantId: targetVariantId || null,
      },
    });

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
      return NextResponse.json({ cartItem: updated, message: 'Cart item quantity updated' });
    }

    const created = await prisma.cartItem.create({
      data: {
        userId: user.userId,
        productId,
        variantId: targetVariantId || null,
        quantity,
      },
    });

    return NextResponse.json({ cartItem: created, message: 'Item added to cart successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error adding to cart' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cartItemId, quantity } = await req.json();

    if (!cartItemId || quantity < 1) {
      return NextResponse.json({ error: 'Invalid cart item payload' }, { status: 400 });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId, userId: user.userId },
      include: { variant: true },
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    if (cartItem.variant && cartItem.variant.stock < quantity) {
      return NextResponse.json({ error: `Only ${cartItem.variant.stock} units available in stock` }, { status: 400 });
    }

    const updated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return NextResponse.json({ cartItem: updated, message: 'Quantity updated' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating cart' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const cartItemId = searchParams.get('id');

    if (!cartItemId) {
      return NextResponse.json({ error: 'Cart Item ID required' }, { status: 400 });
    }

    await prisma.cartItem.deleteMany({
      where: { id: cartItemId, userId: user.userId },
    });

    return NextResponse.json({ message: 'Item removed from cart' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error removing cart item' }, { status: 500 });
  }
}
