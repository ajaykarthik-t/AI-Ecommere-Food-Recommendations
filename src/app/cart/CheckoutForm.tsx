"use client";
import React, { useState } from "react";
import { Button, message } from "antd";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { CartState, ClearCart } from "@/redux/cartSlice";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

function CheckoutForm({
  total,
  setShowCheckoutModal,
}: {
  total: number;
  setShowCheckoutModal: (show: boolean) => void;
}) {
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems }: CartState = useSelector((state: any) => state.cart);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      message.error("Stripe.js hasn't loaded yet. Please try again later.");
      return;
    }

    setProcessing(true);

    try {
      console.log("Starting payment confirmation...");
      
      // Confirm payment
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/cart`,
        },
        redirect: "if_required",
      });

      console.log("Payment confirmation result:", result);

      if (result.error) {
        console.error("Payment error details:", result.error);
        message.error(result.error.message || "Payment failed");
        return;
      }

      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        console.log("Payment succeeded:", result.paymentIntent);
        message.success("Payment successful");
        
        try {
          // Save order to database
          const orderPayload = {
            items: cartItems,
            paymentStatus: "paid",
            orderStatus: "order placed",
            shippingAddress: result.paymentIntent.shipping,
            transactionId: result.paymentIntent.id,
            total,
          };
          
          console.log("Creating order with payload:", orderPayload);
          const orderResponse = await axios.post("/api/orders/place_order", orderPayload);
          console.log("Order created response:", orderResponse.data);
          
          dispatch(ClearCart());
          message.success("Order placed successfully");
          setShowCheckoutModal(false);
          router.push("/profile");
        } catch (orderError: any) {
          console.error("Error creating order:", orderError);
          message.error("Payment was successful, but we couldn't create your order. Please contact support.");
        }
      } else {
        console.log("Payment not completed. Status:", result.paymentIntent?.status);
        message.warning("Payment processing. Please check your order status.");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      message.error(`Checkout error: ${err.message || "An unknown error occurred"}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {processing && <Loader />}
      
      <div className="py-4">
        <PaymentElement />
      </div>
      
      <div className="flex gap-3 mt-4">
        <Button 
          className="flex-1" 
          onClick={() => setShowCheckoutModal(false)}
        >
          Cancel
        </Button>
        <Button 
          type="primary" 
          htmlType="submit" 
          className="flex-1" 
          disabled={!stripe || processing}
        >
          {processing ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </form>
  );
}

export default CheckoutForm;