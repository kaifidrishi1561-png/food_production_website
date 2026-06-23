import type { Request, Response } from "express"
import { Restaurant } from "../models/restaurant.model.ts"
import type { Multer } from "multer";
import uploadImageOnCloudinary from "../utils/imageUpload.ts";
import { Order } from "../models/order.model.ts";
export const createRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body
        const file = req.file
        // const restaurant = await Restaurant.findOne({ user: req.id as any })

        // if (restaurant) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Restaurant already exiit for this user"

        //     })
        // }
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"

            })
        }
        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File)
        const restaurantData = await Restaurant.create({
    restaurantName,
    city,
    country,
    deliveryTime,
    cuisines: JSON.parse(cuisines),
    imageUrl,
    user: req.id as any
});

return res.status(201).json({
    success: true,
    restaurant: restaurantData,
    message: "Restaurant created successfully"
});


    } catch (error:any) {
        console.error(error?.stack || error)
        return res.status(500).json({ message: "internal server error" })

    }
}
export const getRestaurant = async (req: Request, res: Response) => {
    try {
        // findOne so we return a single restaurant object (frontend expects an object with _id)
        const restaurant = await Restaurant.findOne({ user: req.id as any }).populate('menus')
        if (!restaurant) {
            return res.status(200).json({
                success: true,
                restaurant: null,
                message: "Restaurant not found"
            })
        }
        return res.status(200).json({ success: true, restaurant })
        } catch (error: any) {
            console.error(error?.stack || error)
            return res.status(500).json({ message: "internal server error" })
        }
}
export const updateRestaurant = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body
        const file = req.file;
        const restaurant = await Restaurant.findOne({_id : id, user: req.id as any });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            })
        }
        restaurant.restaurantName = restaurantName
        restaurant.city = city
        restaurant.country = country
        restaurant.deliveryTime = deliveryTime
        restaurant.cuisines = JSON.parse(cuisines);
        if (file) {
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File)
            restaurant.imageUrl = imageUrl

        }
        await restaurant.save()
        return res.status(200).json({
            success: true,
            message: "Restaurant Update",
            restaurant
        })

    } catch (error: any) {
        console.log(error)
        return res.status(500).json({ message: "internal server error" })

    }

}
export const getRestaurantOrder = async (req: Request, res: Response) => {
    
    try {
        const restaurant:any = await Restaurant.findOne({ user: req.id as any })
        // If no restaurant for this user, return 404
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            })
        }
        const orders = await Order.find({ restaurant: restaurant._id  }).populate('restaurant').populate('user')
        return res.status(200).json({
            success: true,
            orders
        })
        } catch (error: any) {
            console.error(error?.stack || error)
            return res.status(500).json({ message: "internal server error" })
        }
}
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params
        const { status } = req.body
        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }
        order.status = status
        await order.save()
        return res.status(200).json({
            success: true,
            status: order.status,
            message: "Status updated"
        })      

        } catch (error: any) {
            console.error(error?.stack || error)
            return res.status(500).json({ message: "internal server error" })
        }
}
export const searchRestaurant = async (req: Request, res: Response) => {
    try {
        const searchText = req.params.searchText || ""
        // searchQuery should come from query params
        const searchQuery = (req.query.searchQuery as string) || ""
        const selectedCuisines = (req.query.selectedCuisines as string || "").split(",").filter(cuisine => cuisine);
        const query: any = {};

        // combine text filters into a single $or array
        const orClauses: any[] = [];
        if (searchText) {
            orClauses.push({ restaurantName: { $regex: searchText, $options: 'i' } })
            orClauses.push({ city: { $regex: searchText, $options: 'i' } })
            orClauses.push({ country: { $regex: searchText, $options: 'i' } })
        }
        if (searchQuery) {
            orClauses.push({ restaurantName: { $regex: searchQuery, $options: 'i' } })
            orClauses.push({ cuisines: { $regex: searchQuery, $options: 'i' } })
        }
        if (orClauses.length > 0) {
            query.$or = orClauses
        }
        if (selectedCuisines.length > 0) {
            query.cuisines = { $in: selectedCuisines }
        }

        console.debug('searchRestaurant: query=', JSON.stringify(query), 'searchText=', searchText, 'searchQuery=', searchQuery, 'selectedCuisines=', selectedCuisines)
        const restaurants = await Restaurant.find(query);
        console.debug('searchRestaurant: found=', Array.isArray(restaurants) ? restaurants.length : 0)
        return res.status(200).json({
            success: true,
            data: restaurants
        })


        } catch (error: any) {
            console.error(error?.stack || error)
            return res.status(500).json({ message: "internal server error" })
        }
}
export const getSingleRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurantId = req.params.id
        const restaurant = await Restaurant.findById(restaurantId).populate({
            path: 'menus',
            options: { createdAt: -1 }
        })
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not find"
            })
        }
        return res.status(200).json({
            success:true,restaurant

        })
        } catch (error: any) {
            console.error(error?.stack || error)
            return res.status(500).json({ message: "internal server error" })
        }
}