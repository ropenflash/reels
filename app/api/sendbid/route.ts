// app/api/sendbid/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendBid } from '@/app/api/kafka/producer';

export async function POST(req: NextRequest) {
  try {
    const { gameId, player, amount } = await req.json();
    await sendBid(gameId, player, amount);
    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to send bid' }, { status: 500 });
  }
}
