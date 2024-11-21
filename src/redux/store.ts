import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice";
import { cartSlice } from "./cartSlice";

let initialCartItems = [];
if (typeof window !== "undefined") {
  initialCartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
}

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    cart: cartSlice.reducer,
  },
  preloadedState: {
    cart: {
      cartItems: initialCartItems,
      cartTotal: 0,
    },
  },
});

export default store;
