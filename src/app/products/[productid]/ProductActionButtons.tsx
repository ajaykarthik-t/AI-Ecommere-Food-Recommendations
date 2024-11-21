"use client";
import { Button, message } from "antd";
import { useDispatch } from "react-redux";
import React from "react";
import { useRouter } from "next/navigation";
import { AddProductToCart } from "@/redux/cartSlice";

function ProductActionButtons({ product }: { product: any }) {
  const router = useRouter();
  const dispatch = useDispatch();
  return (
    <div className="flex gap-5 mt-5">
      <Button type="default" disabled={product.countInStock === 0}
       onClick={() => {
        dispatch(
          AddProductToCart({
            ...product,
            quantity: 1,
          })
        );
        message.success("Added to cart");
       }}
      >
        Add to Cart
      </Button>
      <Button type="primary" disabled={product.countInStock === 0}
      onClick={() => {
        dispatch(
          AddProductToCart({
            ...product,
            quantity: 1,
          })
        );
        message.success("Added to cart");
        router.push("/cart");
       }}
      >
        Buy Now
      </Button>
    </div>
  );
}

export default ProductActionButtons;
