import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ reply: 'How can I assist you with your shopping today?', products: [] });
    }

    const lowerQuery = query.toLowerCase();

    // Extract price condition e.g. "under 5000" or "under 2000"
    let maxPrice = 1000000;
    const priceMatch = lowerQuery.match(/(?:under|below|less than|budget)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i);
    if (priceMatch && priceMatch[1]) {
      maxPrice = parseInt(priceMatch[1], 10);
    }

    // Clean terms
    const searchTerms = lowerQuery
      .replace(/(?:under|below|less than|budget)\s*(?:₹|rs\.?|inr)?\s*\d+/gi, '')
      .replace(/(?:find|suggest|show|me|popular|best|cheap|good|with|these|for|a|an)/gi, '')
      .trim()
      .split(/\s+/)
      .filter((t) => t.length > 2);

    const whereClause: any = {
      isApproved: true,
      price: { lte: maxPrice },
    };

    if (searchTerms.length > 0) {
      whereClause.OR = searchTerms.map((term) => ({
        OR: [
          { name: { contains: term } },
          { brand: { contains: term } },
          { tags: { contains: term } },
          { description: { contains: term } },
        ],
      }));
    }

    const matchedProducts = await prisma.product.findMany({
      where: whereClause,
      include: {
        images: true,
        variants: true,
        category: true,
      },
      take: 4,
    });

    let reply = `Here are the top matches I found in our catalog for "${query}":`;
    if (matchedProducts.length === 0) {
      reply = `I couldn't find exact products under ₹${maxPrice} matching "${query}". Here are some of our popular trending items instead:`;
      const fallbackProducts = await prisma.product.findMany({
        where: { isApproved: true, isFeatured: true },
        include: { images: true, variants: true, category: true },
        take: 4,
      });
      return NextResponse.json({ reply, products: fallbackProducts });
    }

    return NextResponse.json({ reply, products: matchedProducts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'AI Assistant processing failed' }, { status: 500 });
  }
}
