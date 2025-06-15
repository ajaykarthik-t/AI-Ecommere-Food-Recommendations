// File: src/redux/store.ts (UPDATE THIS FILE)
import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice";
import { cartSlice } from "./cartSlice";
import { wishlistSlice } from "./wishlistSlice";

let initialCartItems = [];
let initialWishlistItems = [];

if (typeof window !== "undefined") {
  initialCartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  initialWishlistItems = JSON.parse(localStorage.getItem("wishlistItems") || "[]");
}

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    cart: cartSlice.reducer,
    wishlist: wishlistSlice.reducer,
  },
  preloadedState: {
    cart: {
      cartItems: initialCartItems,
      cartTotal: 0,
    },
    wishlist: {
      wishlistItems: initialWishlistItems,
    },
  },
});

export default store;