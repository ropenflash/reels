'use client'
import BidForm from '@/components/game/BidForm';
import LiveBids from '@/components/game/LiveBids';

export default function BiddingGame() {
  return (
    <main>
      <h1>🎯 Real-Time Bidding Game</h1>
      <BidForm onBidSubmitted={() => console.log('Bid sent')} />
      <LiveBids />
    </main>
  );
}
