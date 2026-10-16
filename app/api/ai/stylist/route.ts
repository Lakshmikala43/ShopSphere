import { NextResponse } from 'next/server';
import { generateAIFashionStylistOutfit } from '@/lib/ai/fashion-stylist';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const recommendation = await generateAIFashionStylistOutfit(body);
    return NextResponse.json(recommendation);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'AI Stylist generation failed' }, { status: 500 });
  }
}
