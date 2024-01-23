import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log("MongoDB is connected successfully!");
    return;
  }



  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "artify",
      
    });

    isConnected = true;

    console.log("MongoDB connected");
  } catch (err) {
    console.log(err);
    throw err; // Rethrow the error to indicate that the connection failed
  }
};