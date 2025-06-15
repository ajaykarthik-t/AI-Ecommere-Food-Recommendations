import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    // Check if STRIPE_SECRET_KEY is properly set
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not set");
      return NextResponse.json(
        { message: "Stripe secret key is not configured" },
        { status: 500 }
      );
    }
    
    // Initialize Stripe with the version compatible with your TypeScript definitions
    // @ts-ignore - Ignore API version mismatch as suggested in the error message
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-08-16',
    });
    
    // Get the amount from the request body
    const reqBody = await request.json();
    const { amount } = reqBody;
    
    if (!amount || isNaN(amount) || amount <= 0) {
      console.error("Invalid amount:", amount);
      return NextResponse.json(
        { message: "Invalid amount provided" },
        { status: 400 }
      );
    }
    
    const amountInCents = Math.round(amount * 100);
    console.log(`Creating payment intent for ${amount} (${amountInCents} cents)`);
    
    // Create a payment intent with automatic payment methods
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    console.log(`Payment intent created: ${paymentIntent.id}`);
    
    // Return the client secret
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret 
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    
    // Provide detailed error information
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || 'Failed to create payment intent';
    
    return NextResponse.json(
      { 
        message: errorMessage,
        type: error.type,
        code: error.code,
        detail: error.detail
      },
      { status: statusCode }
    );
  }
}