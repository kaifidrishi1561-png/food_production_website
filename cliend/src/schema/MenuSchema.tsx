import {z } from "zod"
export const MenuSchema = z.object({
    name:z.string().nonempty({message:"name is required"}),
    describtion:z.string().nonempty({message:"description is required"}),
    price:z.number().min(0,{message:"price can not be nagative"}),
    image:z.instanceof(File).optional().refine((file)=>file?.size !== 0,{message:"image file is required"} ),

})
export type MenuFormSchema = z.infer<typeof MenuSchema>;