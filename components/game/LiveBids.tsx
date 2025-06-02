'use client';

import { useEffect, useState } from 'react';

type Bid = {
  player: string;
  amount: number;
  timestamp: number;
};

export default function LiveBids() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('wss://3spt5xfu3j.ap-south-1.awsapprunner.com');

    ws.onopen = () => {
      console.log('✅ WebSocket connected');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'bid') {
          setBids((prev) => [data.bid, ...prev]);
        }
      } catch (err) {
        console.error('❌ Failed to parse WebSocket message:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('❌ WebSocket error:', err);
      setError('WebSocket connection error');
    };

    ws.onclose = (event) => {
      console.warn('⚠️ WebSocket connection closed:', event.reason || event.code);
      setConnected(false);
      if (!event.wasClean) {
        setError('WebSocket disconnected unexpectedly');
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h2>Live Bids</h2>
      {error && <p style={{ color: 'red' }}>⚠️ {error}</p>}
      {!connected && !error && <p>Connecting to live bid feed...</p>}
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
