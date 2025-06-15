// File: src/models/wishlistModel.ts
import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      }
    ],
  },
  {
    timestamps: true,
  }
);

// Create compound index to ensure one wishlist per user
wishlistSchema.index({ user: 1 }, { unique: true });

// Delete if wishlist model already exists
if (mongoose.models && mongoose.models["wishlist"])
  delete mongoose.models["wishlist"];

export default mongoose.model("wishlist", wishlistSchema);