// File: src/redux/wishlistSlice.ts (UPDATE THIS FILE)
import { ProductInterface } from "@/interfaces";
import { createSlice } from "@reduxjs/toolkit";

export interface WishlistState {
  wishlistItems: ProductInterface[];
}

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlistItems: [],
  } as WishlistState,
  reducers: {
    SetWishlistItems: (
      state,
      action: {
        type: string;
        payload: ProductInterface[];
      }
    ) => {
      state.wishlistItems = action.payload;
    },

    AddProductToWishlist: (
      state,
      action: {
        type: string;
        payload: ProductInterface;
      }
    ) => {
      // Check if product already exists in wishlist
      const existingProduct = state.wishlistItems.find(
        (item) => item._id === action.payload._id
      );
      
      if (!existingProduct) {
        state.wishlistItems.push(action.payload);
      }
    },

    RemoveProductFromWishlist: (
      state,
      action: {
        type: string;
        payload: ProductInterface;
      }
    ) => {
      state.wishlistItems = state.wishlistItems.filter(
        (item) => item._id !== action.payload._id
      );
    },

    ClearWishlist: (state) => {
      state.wishlistItems = [];
    },
  },
});

export const { 
  SetWishlistItems,
  AddProductToWishlist, 
  RemoveProductFromWishlist, 
  ClearWishlist 
} = wishlistSlice.actions;