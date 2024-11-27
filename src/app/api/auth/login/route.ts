import { connectDB } from "@/configs/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const user = await User.findOne({ email: reqBody.email });
    if (!user) {
      throw new Error("User does not exist");
    }

    const passwordMatch = await bcrypt.compare(reqBody.password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ id: user._id }, process.env.jwt_secret!, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({
      message: "Login successful",
    });

    // Add CORS headers to allow frontend to communicate with the backend
    response.headers.set("Access-Control-Allow-Origin", process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Set the JWT token in a cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
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
