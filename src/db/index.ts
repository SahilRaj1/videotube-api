import mongoose from "mongoose";
import { DB_NAME } from "../constants";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        const options = {};
        const connectionInstance = mongoose.connect(
            process.env.MONGODB_URI!,
            options
        );
        console.log(
            "MongoDB connected\nDB HOST : ",
            (await connectionInstance).connection.host
        );
    } catch (error) {
        console.error("MONGODB ERROR : ", error);
        process.exit(1);
    }
};

export default connectDB;
