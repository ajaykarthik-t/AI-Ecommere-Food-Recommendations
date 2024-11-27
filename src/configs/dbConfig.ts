import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!);  
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};
