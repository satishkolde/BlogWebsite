import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_CONNECTION_URI}/${DB_NAME}`);
        console.log("Successfully connected to db!!");
    } catch(err) {
        console.log("Error While connecting to the db",err);
    }
}