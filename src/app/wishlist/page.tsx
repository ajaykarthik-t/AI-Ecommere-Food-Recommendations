// File: src/app/wishlist/page.tsx (CREATE THIS FILE)
"use client";
import { WishlistState, RemoveProductFromWishlist, ClearWishlist } from "@/redux/wishlistSlice";
import { AddProductToCart, CartState } from "@/redux/cartSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, message, Empty } from "antd";
import { Rate } from "antd";
import Image from "next/image";
import Link from "next/link";
import { ProductInterface } from "@/interfaces";

function Wishlist() {
  const { wishlistItems }: WishlistState = useSelector((state: any) => state.wishlist);
  const { cartItems }: CartState = useSelector((state: any) => state.cart);
  const dispatch = useDispatch();

  const handleRemoveFromWishlist = (product: ProductInterface) => {
    dispatch(RemoveProductFromWishlist(product));
    message.success("Removed from wishlist");
  };

  const handleAddToCart = (product: ProductInterface) => {
    dispatch(AddProductToCart({ ...product, quantity: 1 }));
    message.success("Added to cart");
  };

  const handleClearWishlist = () => {
    dispatch(ClearWishlist());
    message.success("Wishlist cleared");
  };

  const isInCart = (productId: string) => {
    return cartItems.some((item: ProductInterface) => item._id === productId);
  };

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Wishlist ({wishlistItems.length})</h1>
        {wishlistItems.length > 0 && (
          <Button 
            type="default" 
            onClick={handleClearWishlist}
            className="text-red-500 border-red-500 hover:bg-red-50"
          >
            Clear Wishlist
          </Button>
        )}
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product: ProductInterface) => (
            <div
              key={product._id}
              className="border border-gray-300 rounded-lg p-4 flex flex-col gap-3 hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <Link href={`/products/${product._id}`}>
                  <div className="text-center">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      height={150}
                      width={150}
                      className="mx-auto object-cover"
                    />
                  </div>
                </Link>
                
                <button
                  onClick={() => handleRemoveFromWishlist(product)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-md hover:bg-red-50 transition-colors"
                  title="Remove from wishlist"
                >
                  <i className="ri-close-line text-red-500"></i>
                </button>
              </div>

              <Link href={`/products/${product._id}`}>
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-medium line-clamp-2 hover:text-blue-600">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <Rate
                      disabled
                      defaultValue={product.rating || 0}
                      style={{ color: "#26577C" }}
                      allowHalf
                      className="text-xs"
                    />
                    <span className="text-xs text-gray-500">
                      ({product.rating || 0})
                    </span>
                  </div>

                  <div className="text-lg font-semibold text-green-600">
                    ${product.price}
                  </div>

                  <span className="text-xs text-gray-500">
                    {product.countInStock > 0
                      ? `${product.countInStock} in stock`
                      : "Out of stock"}
                  </span>
                </div>
              </Link>

              <div className="mt-auto flex gap-2">
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleAddToCart(product)}
                  disabled={isInCart(product._id || "") || product.countInStock === 0}
                  className="flex-1"
                >
                  {isInCart(product._id || "") ? "In Cart" : "Add to Cart"}
                </Button>
                
                <Button
                  type="default"
                  size="small"
                  onClick={() => handleRemoveFromWishlist(product)}
                  className="text-red-500 border-red-300 hover:bg-red-50"
                >
                  <i className="ri-heart-fill"></i>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-gray-500 mb-4">
                  Start adding products you love to your wishlist
                </p>
                <Link href="/">
                  <Button type="primary">Continue Shopping</Button>
                </Link>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}

export default Wishlist;