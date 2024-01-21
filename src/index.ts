import dotenv from "dotenv";
import connectDB from "./db";
import app from "./app";

dotenv.config();

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.error("MONGODB ERROR : ", err);
});