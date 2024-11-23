import { config } from "dotenv";
import mongoose from "mongoose";

config();

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.h7rfr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

export default async function connectDB() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await mongoose.connect(uri).then((res) => {
      console.log("DB connected");
    });
  } catch (error) {
    console.log(error);
  }
}
