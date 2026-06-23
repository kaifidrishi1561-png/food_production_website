import {z} from "zod"
 
export const  restaurantFormSchema = z.object({
    restaurantName:z.string().nonempty({message:"restaurant name is required"}),
    city:z.string().nonempty({message:"city is required"}),
    country:z.string().nonempty({message:"Country is required"}),
    deliveryTime:z.number().min(0,{message:"deleviry time is not negative"}),
    cuisines:z.array(z.string()),
    imageFile:z.instanceof(File).optional().refine((file)=>file?.size !== 0,{message:"image file is required"} ),

});


export type RestaurantFormSchema = z.infer<typeof restaurantFormSchema >;