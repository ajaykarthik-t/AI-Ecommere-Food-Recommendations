import { connectDB } from "@/configs/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/productModel";
import { validateJWT } from "@/helpers/validateJWT";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const userId = await validateJWT(request);
    // check if product already exists
    const reqBody = await request.json();
    const productExists = await Product.findOne({
      name: reqBody.name,
    });
    if (productExists) {
      throw new Error("Product already exists");
    }

    reqBody.createdBy = userId;
    const product = new Product(reqBody);
    await product.save();

    return NextResponse.json({
      message: "Product created successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await validateJWT(request);
    const filters: any = {};
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    if (category) {
      filters["category"] = category;
    }

    if (search) {
      filters["name"] = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filters)
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });
    return NextResponse.json({
      data: products,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      {
        status: 500,
      }
    );
  }
}
