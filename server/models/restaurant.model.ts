import mongoose, { mongo, Schema, Types,Document } from "mongoose";

export interface IRestaurant{
    user:mongoose.Schema.Types.ObjectId
    restaurantName:string,
    city:string,
    country:string,
    deliveryTime:number,
    cuisines:string[],
    imageUrl:string,
    menus:mongoose.Schema.Types.ObjectId[]
}
declare global {
    namespace Express {
        interface Request {
            id: string
        }
    }
}

export interface IRestaurantDocument extends IRestaurant,Document{
    
    createdAt:Date,
    updatedAt:Date
}
const restaurantSchema = new mongoose.Schema<IRestaurantDocument>({
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
            },
        restaurantName:{
            type:String,
            
            required:true
            },
        city:{
            type:String,
            required:true
            },
        country:{
            type:String,
            required:true
            },
            
            cuisines:[{
                type:String,
                required:true
                }],
                menus:[{type:mongoose.Schema.Types.ObjectId, ref:"Menu"}],
                imageUrl:{
                    type:String,
                    required:true
                }

},{timestamps:true})

export const Restaurant = mongoose.model("Restaurant",restaurantSchema)