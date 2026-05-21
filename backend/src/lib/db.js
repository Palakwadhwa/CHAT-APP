import mongoose from "mongoose"

export const db = async () =>{
    
try {
    
    const connect = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB connected ${connect.connection.host}`)      
    
} catch (error) {
        console.log('MongoDB Connection Failed',error)
    }
    
}