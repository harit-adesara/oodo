import mongoose, { Schema } from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB connected");
  } catch (error) {
    process.exit(1);
  }
};
