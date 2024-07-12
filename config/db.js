import mongoose, { mongo } from "mongoose";
import colors from "colors";
import morgan from "morgan";
import dotenv from "dotenv"



const connectDB = async ()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URL)
        console.log("Well done abbai")
    }
    catch(error){
        console.log(`Error in mongodb ${error}`.bgRed.white)

    }
}
export default connectDB;   