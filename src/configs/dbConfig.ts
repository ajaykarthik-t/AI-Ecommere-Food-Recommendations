import mongoose from "mongoose";

let isConnected = false; // Track connection status

export const connectDB = async () => {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    const dbUri = process.env.MONGO_URL;
    console.log("MongoDB URI:", dbUri); // Log the URI to see its value
    if (!dbUri) {
      throw new Error("MongoDB URI is not defined.");
    }

    // Configure mongoose to prevent multiple connections
    mongoose.set('strictQuery', false);
    
    await mongoose.connect(dbUri, {
      bufferCommands: false, // Disable mongoose buffering
    });
    
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
    isConnected = false;
  }
};