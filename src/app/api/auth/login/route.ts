import { connectDB } from "@/configs/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    // check if user exists in database or not
    const user = await User.findOne({ email: reqBody.email });
    if (!user) {
      throw new Error("User does not exist");
    }

    const passwordMatch = await bcrypt.compare(reqBody.password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    // create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // Create response
    const response = NextResponse.json({
      message: "Login successful",
    });

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // Cookie expiry (7 days)
    });

    // Add CORS headers to the response
    response.headers.set("Access-Control-Allow-Origin", process.env.NEXT_PUBLIC_FRONTEND_URL || "*");  // Use your frontend domain here
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "An error occurred during login" },
      { status: 400 }
    );
  }
}
