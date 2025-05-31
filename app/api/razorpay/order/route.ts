import Razorpay from "razorpay";

interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number | string;
  amount_paid: number | string;
  amount_due: number | string;
  currency: string;
  receipt?: string;
  status: string;
  attempts: number;
  created_at: number;
}

// Define type for the options passed to create order:
interface CreateOrderOptions {
  amount: number;
  currency: string;
  receipt: string;
  payment_capture?: number; // optional, usually 1 or 0
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST() {
  const options: CreateOrderOptions = {
    amount: 50000, // ₹500 in paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order: RazorpayOrder = await razorpay.orders.create(options);
    return new Response(JSON.stringify(order), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const error = err as { message: string };
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
