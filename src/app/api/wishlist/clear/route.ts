// File: src/app/api/wishlist/clear/route.ts
import { connectDB } from "@/configs/dbConfig";
import { validateJWT } from "@/helpers/validateJWT";
import { NextRequest, NextResponse } from "next/server";
import Wishlist from "@/models/wishlistModel";

connectDB();

// DELETE - Clear entire wishlist
export async function DELETE(request: NextRequest) {
  try {
    const userId = await validateJWT(request);
    
    // Find and clear user's wishlist
    const wishlist = await Wishlist.findOne({ user: userId });
    
    if (!wishlist) {
      throw new Error("Wishlist not found");
    }

    // Clear all products from wishlist
    wishlist.products = [];
    await wishlist.save();

    return NextResponse.json({
      message: "Wishlist cleared successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 400,
      }
    );
  }
}