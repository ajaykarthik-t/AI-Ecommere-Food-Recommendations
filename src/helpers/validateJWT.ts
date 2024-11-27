import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Function to validate the JWT from cookies
export const validateJWT = async (request: NextRequest) => {
  try {
    // Retrieve token from cookies
    const token = request.cookies.get("token")?.value || "";
    if (!token) {
      throw new Error("No token provided"); // Error when token is not present
    }

    // Verify the token using JWT_SECRET environment variable
    const decryptedToken: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Return the user ID from the decoded token
    return decryptedToken.id;
  } catch (error: any) {
    // Log the error for debugging
    console.error("JWT validation error:", error);

    // Differentiating between errors and providing more helpful messages
    if (error.message === "No token provided") {
      throw new Error("No authentication token provided.");
    }
    if (error.message === "jwt expired") {
      throw new Error("Authentication token has expired.");
    }
    throw new Error("Invalid or malformed token.");
  }
};
