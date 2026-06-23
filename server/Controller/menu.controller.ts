import type { Request,Response } from "express"
import uploadImageOnCloudinary from "../utils/imageUpload.ts";
import {Menu} from "../models/menu.model.ts"
import { Restaurant } from "../models/restaurant.model.ts";
import mongoose from "mongoose";
import { rmSync } from "node:fs";
import { defaultMaxListeners } from "node:events";

export const addMenu = async(req:Request,res:Response)=>{
    try {
        const {name ,describtion, price} = req.body
        const file = req.file;
        if(!file){
            return res.status(400).json({
                success:false,
                message:"image is missing"
            })
        }
        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File)
        const menu =  await Menu.create({
            name,describtion,price,image:imageUrl
        });
        const restaurant = await Restaurant.findOne({user:req.id as any})
        if(restaurant){
            (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id as any);
            await restaurant.save();    
        }
        return res.status(201).json({success:true,message:"menu added succesfully",menu})
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"internal server error"
        })
        
    }
}
export const editMenu = async(req:Request,res:Response)=>{
    try {
        const {id} = req.params
        const {name, describtion,price} = req.body
        const file = req.file
        const menu = await Menu.findById(id)
        if(!menu){
            return res.status(404).json({
                success:false,
                message:"Menu not found"
            })
        }
        if(name)menu.name = name
        if(describtion)menu.describtion = describtion
        if(price)menu.price = price
        if(file){
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File)
            menu.image =imageUrl
        }
        await menu.save()
        return res.status(200).json({
            success:true,
            message:"menu updated",
            menu
        })
    } catch (error) {
         console.log(error)
        return res.status(500).json({
            message:"internal server error"
        })
    }
}