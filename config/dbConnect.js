import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

function dbConnect() {
  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(()=>{
    console.log("Connected to database");
  })
}

export default dbConnect;
