'use client';

import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
}

// Declare window.Razorpay properly
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export default function PayPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePayment = async () => {
    setMessage(null);

    if (!session) {
      signIn('google');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to create Razorpay order.');

      const order: RazorpayOrder = await res.json();

      const razorpayOptions: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'Video Access',
        description: 'Payment to access premium video',
        prefill: {
          name: session.user?.name || '',
          email: session.user?.email || '',
        },
        theme: { color: '#3399cc' },
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                email: session.user?.email,
                courseId: "3fd7337c-f656-411d-8f3f-5be277f19f4c"
              }),
            });

            if (!verifyRes.ok) throw new Error('Payment verification failed.');

            const data: { verified: boolean } = await verifyRes.json();

            if (data.verified) {
              setMessage({ type: 'success', text: 'Payment successful! Redirecting...' });
              setTimeout(() => window.location.href = '/video', 2000);
            } else {
              setMessage({ type: 'error', text: 'Payment verification failed. Please contact support.' });
            }
          } catch (err) {
            const error = err as Error;
            setMessage({ type: 'error', text: error.message || 'Verification error.' });
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setMessage({ type: 'error', text: 'Payment popup closed before completion.' });
            setLoading(false);
          },
        },
      };

      const razor = new window.Razorpay(razorpayOptions);
      razor.open();
    } catch (err) {
      const error = err as Error;
      console.error('Payment initiation error:', error);
      setMessage({ type: 'error', text: error.message || 'Something went wrong initiating payment.' });
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {session ? (
        <>
          <button
            onClick={handlePayment}
            disabled={loading}
            className={`px-6 py-3 rounded text-white ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Processing Payment...' : 'Pay ₹500 to Watch Video'}
          </button>
          {message && (
            <p
              role="alert"
              className={`mt-4 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
            >
              {message.text}
            </p>
          )}
        </>
      ) : (
        <button
          onClick={() => signIn('google')}
          className="px-6 py-3 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}
