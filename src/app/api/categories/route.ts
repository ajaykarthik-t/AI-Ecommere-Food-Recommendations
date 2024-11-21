import { connectDB } from "@/configs/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Category from "@/models/categoryModel";
import { validateJWT } from "@/helpers/validateJWT";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const userId = await validateJWT(request);
    // check if category already exists
    const reqBody = await request.json();
    const categoryExists = await Category.findOne({
      name: reqBody.name,
    });
    if (categoryExists) {
      throw new Error("Category already exists");
    }

    reqBody.createdBy = userId;
    const category = new Category(reqBody);
    await category.save();

    return NextResponse.json({
      message: "Category created successfully",
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
    const categories = await Category.find()
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });
    return NextResponse.json({
      data: categories,
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
