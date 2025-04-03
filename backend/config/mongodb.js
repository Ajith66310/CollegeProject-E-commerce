import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("DB connected");
  });
  await mongoose.connect("mongodb+srv://Ajith:202930@cluster0.6imot.mongodb.net/E-commerce");
};

export default connectDB;
