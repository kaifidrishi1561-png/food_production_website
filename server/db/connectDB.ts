// mongopassword=HRwLuQqpN2kt2ADD
// kaifidrishi1561_db_user
 
import mongoose from "mongoose"
const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI as string)
        console.log('mongo connected')
    } catch (error) {
        console.log(error)
    }
}
export default connectDB