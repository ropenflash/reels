'use client';
import { useState } from 'react';

export default function BidForm({ onBidSubmitted }: { onBidSubmitted: () => void }) {
  const [player, setPlayer] = useState('');
  const [amount, setAmount] = useState('');
  const gameId = 'game-123'; // could be dynamic

  const submitBid = async () => {
    await fetch('/api/sendbid', {
      method: 'POST',
      body: JSON.stringify({ gameId, player, amount: parseFloat(amount) }),
    });

    onBidSubmitted();
    setAmount('');
  };

  return (
    <div>
      <h2>Place a Bid</h2>
      <input value={player} onChange={(e) => setPlayer(e.target.value)} placeholder="Your name" />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Bid amount"
      />
      <button onClick={submitBid}>Submit</button>
    </div>
  );
}
