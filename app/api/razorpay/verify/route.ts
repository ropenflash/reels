import { NextRequest } from "next/server";
import crypto from "crypto";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, courseId } = body;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  const isValid = generatedSignature === razorpay_signature;

  if (!isValid) {
    return new Response(JSON.stringify({ verified: false }), { status: 400 });
  }

  await prisma.payment.create({
    data: {
      email,
      razorpay_order_id,
      razorpay_payment_id,
      verified: true,
      course: {
        connect: { id: courseId },
      },
    },
  });

  return new Response(JSON.stringify({ verified: true }));
}
