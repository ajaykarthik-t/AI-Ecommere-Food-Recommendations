import { connectDB } from "@/configs/dbConfig"; // Your database connection configuration
import { validateJWT } from "@/helpers/validateJWT"; // JWT validation function
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel"; // Your User model
connectDB(); // Connect to the database

export async function GET(request: NextRequest) {
  try {
    // Step 1: Validate the JWT token to get the user ID
    const userId = await validateJWT(request);

    // Step 2: Fetch the user from the database, excluding the password field
    const user = await User.findById(userId).select("-password");

    // Step 3: If the user does not exist, throw an error
    if (!user) {
      throw new Error("User not found");
    }

    // Step 4: Return the user data as the response
    return NextResponse.json({
      data: user,
    });
  } catch (error: any) {
    // Step 5: Handle errors and send a response with status 400
    return NextResponse.json(
      {
        message: error.message || "An error occurred", // Provide the error message or a fallback message
      },
      { status: 400 }
    );
  }
}
