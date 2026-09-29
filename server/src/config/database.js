import mongoose from "mongoose";

export async function connectDatabase(uri) {
  if (!uri) {
    console.info("MONGODB_URI is not set; calculation history is disabled.");
    return false;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.info("Connected to MongoDB.");
    return true;
  } catch (error) {
    console.warn(`MongoDB is unavailable; calculations will work without history. ${error.message}`);
    return false;
  }
}
