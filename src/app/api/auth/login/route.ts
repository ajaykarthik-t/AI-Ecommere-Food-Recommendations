import { connectDB } from "@/configs/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Connect to the database
connectDB();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const reqBody = await request.json();

    // Validate input
    if (!reqBody.email || !reqBody.password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user exists in the database
    const user = await User.findOne({ email: reqBody.email });
    if (!user) {
      throw new Error("User does not exist");
    }

    // Check if password matches
    const passwordMatch = await bcrypt.compare(reqBody.password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // Set token in the cookie
    const response = NextResponse.json({
      message: "Login successful",
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",  // Only secure in production
      path: "/",
      maxAge: 60 * 60 * 24 * 7,  // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "An error occurred during login",
      },
      { status: 400 }
    );
  }
}
