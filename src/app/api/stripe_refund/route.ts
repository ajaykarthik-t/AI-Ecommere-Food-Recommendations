import { NextRequest, NextResponse } from "next/server";
const stripe = require("stripe")(process.env.stripe_secret_key!);
import Order from "@/models/orderModel";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const trasactionId = reqBody.transactionId;
    const refund = await stripe.refunds.create({
      payment_intent: trasactionId,
    });

    // change order status to refunded

    await Order.findOneAndUpdate(
      { _id: reqBody.orderId },
      { paymentStatus: "refunded" }
    );

    return NextResponse.json({
      refund,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}
