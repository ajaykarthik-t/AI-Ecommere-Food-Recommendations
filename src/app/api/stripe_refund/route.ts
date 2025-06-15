import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import Order from "@/models/orderModel";

export async function POST(request: NextRequest) {
  try {
    // Initialize Stripe with the version compatible with your TypeScript definitions
    // @ts-ignore - Ignore API version mismatch as suggested in the error message
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-08-16',
    });

    const reqBody = await request.json();
    const transactionId = reqBody.transactionId;
    
    console.log("Processing refund for transaction:", transactionId);
    
    const refund = await stripe.refunds.create({
      payment_intent: transactionId,
    });

    // Update order status to refunded
    await Order.findOneAndUpdate(
      { _id: reqBody.orderId },
      { paymentStatus: "refunded" }
    );

    console.log("Refund processed successfully:", refund.id);
    return NextResponse.json({
      refund,
    });
  } catch (error: any) {
    console.error("Stripe refund error:", error);
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}