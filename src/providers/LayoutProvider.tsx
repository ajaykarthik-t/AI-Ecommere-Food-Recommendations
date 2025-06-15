// File: src/providers/LayoutProvider.tsx (UPDATE THIS FILE)
"use client";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import axios from "axios";
import { Badge, message, Popover } from "antd";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { SetCurrentUser } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { CartState } from "@/redux/cartSlice";
import { WishlistState, SetWishlistItems } from "@/redux/wishlistSlice";

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useSelector((state: any) => state.user);
  const { cartItems }: CartState = useSelector((state: any) => state.cart);
  const { wishlistItems }: WishlistState = useSelector((state: any) => state.wishlist);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isPrivatePage =
    pathname !== "/auth/login" && pathname !== "/auth/register";
  const dispatch = useDispatch();
  
  const getCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/auth/currentuser");
      dispatch(SetCurrentUser(response.data.data));
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch wishlist from database when user logs in
  const fetchWishlist = async () => {
    try {
      const response = await axios.get("/api/wishlist");
      dispatch(SetWishlistItems(response.data.data));
    } catch (error: any) {
      // Silently fail - user might not have a wishlist yet
      console.log("No wishlist found or error fetching wishlist");
    }
  };

  React.useEffect(() => {
    if (isPrivatePage) {
      getCurrentUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPrivatePage, pathname]);

  // Fetch wishlist when user is authenticated
  React.useEffect(() => {
    if (currentUser && isPrivatePage) {
      fetchWishlist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, isPrivatePage]);

  useEffect(() => {
    // Save cart items to localStorage when they change
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Remove localStorage persistence for wishlist since we're using database
  // The wishlist will be fetched from database on login

  const onLogout = async () => {
    try {
      setLoading(true);
      await axios.get("/api/auth/logout");
      message.success("Logout successfully");
      dispatch(SetCurrentUser(null));
      dispatch(SetWishlistItems([])); // Clear wishlist on logout
      router.push("/auth/login");
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div className="flex flex-col gap-2 p-2">
      <div
        className="flex gap-2 items-center cursor-pointer text-md"
        onClick={() => router.push("/profile")}
      >
        <i className="ri-shield-user-line"></i>
        <span>Profile</span>
      </div>

      <div
        className="flex gap-2 items-center cursor-pointer text-md"
        onClick={() => onLogout()}
      >
        <i className="ri-logout-box-r-line"></i>
        <span>Logout</span>
      </div>
    </div>
  );

  return (
    <div>
      {loading && <Loader />}
      {isPrivatePage && currentUser && (
        <>
          <div className="bg-primary py-2 px-5 flex justify-between items-center">
            <div
              className="flex gap-2 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <h1 className="text-2xl font-bold text-red-500">Green</h1>
              <h1 className="text-2xl font-bold text-yellow-500">Kart</h1>
            </div>

            <div className="flex gap-5 items-center">
              {/* Wishlist Icon */}
              <Badge count={wishlistItems.length} className="cursor-pointer">
                <i
                  className="ri-heart-line text-white text-2xl hover:text-red-300 transition-colors"
                  onClick={() => router.push("/wishlist")}
                  title="Wishlist"
                ></i>
              </Badge>
              
              {/* Cart Icon */}
              <Badge count={cartItems.length} className="cursor-pointer">
                <i
                  className="ri-shopping-cart-line text-white text-2xl"
                  onClick={() => router.push("/cart")}
                  title="Cart"
                ></i>
              </Badge>
              
              <Popover content={content} trigger="click">
                <div className="flex h-8 w-8 bg-white p-2 rounded-full items-center justify-center cursor-pointer">
                  <span>{currentUser.name[0]}</span>
                </div>
              </Popover>
            </div>
          </div>
          <div className="p-5">{children}</div>
        </>
      )}

      {!isPrivatePage && children}
    </div>
  );
}

export default LayoutProvider;