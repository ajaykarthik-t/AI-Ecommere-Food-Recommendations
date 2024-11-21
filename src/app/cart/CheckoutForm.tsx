"use client";
import React from "react";
import { Button, message } from "antd";
import {
  PaymentElement,
  AddressElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useSelector } from "react-redux";
import { CartState, ClearCart } from "@/redux/cartSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Loader from "@/components/Loader";

function CheckoutForm({
  total,
  setShowCheckoutModal,
}: {
  total: number;
  setShowCheckoutModal: any;
}) {
  const [loading, setLoading] = React.useState(false);
  const elements = useElements();
  const stripe = useStripe();
  const { cartItems }: CartState = useSelector((state: any) => state.cart);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (event: any) => {
    try {
      setLoading(true);
      event.preventDefault();
      if (!stripe || !elements) {
        throw new Error("Stripe.js hasn't loaded yet.");
      }
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "http://localhost:3000/cart",
        },
        redirect: "if_required",
      });

      if (result.error) {
        throw result.error;
      }

      message.success("Payment successful");

      // save order to database
      const orderPayload = {
        items: cartItems,
        paymentStatus: "paid",
        orderStatus: "order placed",
        shippingAddress: result.paymentIntent.shipping,
        transactionId: result.paymentIntent.id,
        total,
      };
      await axios.post("/api/orders/place_order", orderPayload);
      dispatch(ClearCart());
      message.success("Order placed successfully");
      router.push("/profile");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {loading && <Loader />}
      <form onSubmit={handleSubmit}>
        <div className="h-[350px] overflow-y-scroll pr-5">
          <PaymentElement />
          <AddressElement
            options={{
              allowedCountries: ["US"],
              mode: "shipping",
            }}
          />
        </div>
        <div className="flex gap-5">
          <Button
            htmlType="button"
            className="mt-5"
            block
            onClick={() => setShowCheckoutModal(false)}
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" className="mt-5" block>
            Pay
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CheckoutForm;
