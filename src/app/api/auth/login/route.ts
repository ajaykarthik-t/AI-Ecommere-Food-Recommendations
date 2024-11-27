import { connectDB } from "@/configs/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    // Check if the user exists
    const user = await User.findOne({ email: reqBody.email });
    if (!user) {
      throw new Error("User does not exist");
    }

    // Validate the password
    const passwordMatch = await bcrypt.compare(reqBody.password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    // Create a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // Create the response object
    const response = NextResponse.json({
      message: "Login successful",
    });

    // Add CORS headers
    response.headers.set(
      "Access-Control-Allow-Origin",
      process.env.NEXT_PUBLIC_DOMAIN || "https://aigrocery.vercel.app/"
    );
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Set the JWT token in a cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "none", // Correct lowercase "none" for cross-origin
      secure: true, // Ensure HTTPS is used
    });

    return response;
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
