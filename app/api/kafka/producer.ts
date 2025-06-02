// backend/producer.ts
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'bidding-game',
  brokers: [process.env.BOOTSTRAP_SERVERS || ""],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: process.env.USERNAME || "",
    password: process.env.PASSWORD || "",
  },
});

const producer = kafka.producer();

export const sendBid = async (gameId: string, player: string, amount: number) => {
  await producer.connect();

  await producer.send({
    topic: 'bids',
    messages: [
      {
        key: gameId,
        value: JSON.stringify({
          player,
          amount,
          timestamp: Date.now(),
        }),
      },
    ],
  });

  console.log(`✅ Bid sent: ${player} bid $${amount}`);
  await producer.disconnect();
};
