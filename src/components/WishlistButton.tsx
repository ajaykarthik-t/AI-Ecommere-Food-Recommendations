// File: src/components/WishlistButton.tsx (UPDATE THIS FILE)
"use client";
import { ProductInterface } from "@/interfaces";
import { AddProductToWishlist, RemoveProductFromWishlist, WishlistState } from "@/redux/wishlistSlice";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

function WishlistButton({ product }: { product: ProductInterface }) {
  const dispatch = useDispatch();
  const { wishlistItems }: WishlistState = useSelector((state: any) => state.wishlist);
  const [loading, setLoading] = React.useState(false);
  
  const isInWishlist = wishlistItems.some(
    (item: ProductInterface) => item._id === product._id
  );

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if button is inside a Link
    e.stopPropagation(); // Prevent event bubbling
    
    if (loading) return; // Prevent multiple clicks
    
    try {
      setLoading(true);
      
      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete(`/api/wishlist?productId=${product._id}`);
        dispatch(RemoveProductFromWishlist(product));
        message.success("Removed from wishlist");
      } else {
        // Add to wishlist
        await axios.post("/api/wishlist", { productId: product._id });
        dispatch(AddProductToWishlist(product));
        message.success("Added to wishlist");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleWishlistToggle}
      disabled={loading}
      className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
        isInWishlist 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <i 
        className={`text-xl ${
          loading 
            ? 'ri-loader-4-line animate-spin' 
            : isInWishlist 
              ? 'ri-heart-fill' 
              : 'ri-heart-line'
        }`}
      ></i>
    </button>
  );
}

export default WishlistButton;