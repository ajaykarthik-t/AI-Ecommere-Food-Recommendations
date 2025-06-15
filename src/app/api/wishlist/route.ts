// File: src/app/api/wishlist/route.ts
import { connectDB } from "@/configs/dbConfig";
import { validateJWT } from "@/helpers/validateJWT";
import { NextRequest, NextResponse } from "next/server";
import Wishlist from "@/models/wishlistModel";
import Product from "@/models/productModel";

connectDB();

// GET - Fetch user's wishlist
export async function GET(request: NextRequest) {
  try {
    const userId = await validateJWT(request);
    
    // Find user's wishlist and populate product details
    const wishlist = await Wishlist.findOne({ user: userId })
      .populate({
        path: "products",
        populate: {
          path: "createdBy",
          select: "name"
        }
      });

    if (!wishlist) {
      return NextResponse.json({
        data: [],
      });
    }

    return NextResponse.json({
      data: wishlist.products,
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

// POST - Add product to wishlist
export async function POST(request: NextRequest) {
  try {
    const userId = await validateJWT(request);
    const reqBody = await request.json();
    const { productId } = reqBody;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Find user's wishlist or create if doesn't exist
    let wishlist = await Wishlist.findOne({ user: userId });
    
    if (!wishlist) {
      // Create new wishlist for user
      wishlist = new Wishlist({
        user: userId,
        products: [productId]
      });
    } else {
      // Check if product already in wishlist
      if (wishlist.products.includes(productId)) {
        throw new Error("Product already in wishlist");
      }
      
      // Add product to existing wishlist
      wishlist.products.push(productId);
    }

    await wishlist.save();

    return NextResponse.json({
      message: "Product added to wishlist successfully",
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

// DELETE - Remove product from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const userId = await validateJWT(request);
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");

    if (!productId) {
      throw new Error("Product ID is required");
    }

    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ user: userId });
    
    if (!wishlist) {
      throw new Error("Wishlist not found");
    }

    // Remove product from wishlist
    wishlist.products = wishlist.products.filter(
      (id: any) => id.toString() !== productId
    );

    await wishlist.save();

    return NextResponse.json({
      message: "Product removed from wishlist successfully",
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