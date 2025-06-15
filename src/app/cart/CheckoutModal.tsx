"use client";
import { Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import Loader from "@/components/Loader";

// Load Stripe outside component to avoid recreating it
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

interface CheckoutModalProps {
  showCheckoutModal: boolean;
  setShowCheckoutModal: (show: boolean) => void;
  total: number;
}

function CheckoutModal({
  showCheckoutModal,
  setShowCheckoutModal,
  total,
}: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the modal opens
    if (showCheckoutModal) {
      setLoading(true);
      
      // Check if the Stripe publishable key is configured
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        console.error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured");
        message.error("Payment system is not properly configured. Please contact support.");
        setLoading(false);
        return;
      }
      
      console.log("Creating payment intent for amount:", total);
      
      axios
        .post("/api/stripe_client_secret", {
          amount: total,
        })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
          console.log("Client secret loaded successfully");
        })
        .catch((err) => {
          console.error("Error creating payment intent:", err);
          
          // Show detailed error message
          const errorMsg = err.response?.data?.message || err.message || "Could not initialize payment";
          message.error(errorMsg);
          
          // Log additional details if available
          if (err.response?.data) {
            console.error("Error details:", err.response.data);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [showCheckoutModal, total]);

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#000000',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Modal
      title={
        <div className="flex justify-between items-center font-bold text-xl">
          <span>Checkout</span>
          <span>Total: ${total}</span>
        </div>
      }
      open={showCheckoutModal}
      onCancel={() => setShowCheckoutModal(false)}
      centered
      closable={false}
      footer={null}
      width={600}
    >
      {loading ? (
        <Loader />
      ) : clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm 
            total={total} 
            setShowCheckoutModal={setShowCheckoutModal} 
          />
        </Elements>
      ) : (
        <div className="py-10 text-center">
          <p>Failed to initialize payment form. Please try again.</p>
        </div>
      )}
    </Modal>
  );
}

export default CheckoutModal;