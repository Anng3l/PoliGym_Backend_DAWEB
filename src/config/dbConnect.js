import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnect = async () => {
    try
    {
        const connect = await mongoose.connect(`${process.env.CONNECTION_STRING}`);
        console.log(`Database Connected: ${connect.connection.host}, ${connect.connection.name}`);
    }
    catch (error)
    {
        console.log(error.message);
    }
};

export default dbConnect;