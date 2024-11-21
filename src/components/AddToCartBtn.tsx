"use client";
import { ProductInterface } from "@/interfaces";
import { AddProductToCart, CartState } from "@/redux/cartSlice";
import { Button, message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function AddToCartBtn({ product }: { product: ProductInterface }) {
  const dispatch = useDispatch();
  const { cartItems }: CartState = useSelector((state: any) => state.cart);
  return (
    <div>
      <Button
        type="primary"
        size="small"
        className="btn-small"
        onClick={(e) => {
          dispatch(
            AddProductToCart({
              ...product,
              quantity: 1,
            })
          );
          message.success("Added to cart");
        }}
        disabled={cartItems.some(
          (item: ProductInterface) =>
            item._id === product._id
        ) || product.countInStock === 0}
      >
        Add to cart
      </Button>
    </div>
  );
}

export default AddToCartBtn;
