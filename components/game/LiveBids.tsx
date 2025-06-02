'use client';
import { useEffect, useState } from 'react';

type Bid = {
  player: string;
  amount: number;
  timestamp: number;
};

export default function LiveBids() {
  const [bids, setBids] = useState<Bid[]>([]);

  useEffect(() => {
    const ws = new WebSocket('wss://3spt5xfu3j.ap-south-1.awsapprunner.com');
// adjust if needed

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'bid') {
        setBids((prev) => [data.bid, ...prev]);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div>
      <h2>Live Bids</h2>
      <ul>
        {bids.map((bid, i) => (
          <li key={i}>
            💰 {bid.player} bid ${bid.amount} at {new Date(bid.timestamp).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
