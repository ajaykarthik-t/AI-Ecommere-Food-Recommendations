import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const dbUri = process.env.MONGO_URL;
    console.log("MongoDB URI:", dbUri); // Log the URI to see its value
    if (!dbUri) {
      throw new Error("MongoDB URI is not defined.");
    }
    await mongoose.connect(dbUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};
