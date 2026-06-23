import  Express  from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.ts";
import upload from "../middleware/multer.ts";
import { createRestaurant, getRestaurant, getRestaurantOrder, getSingleRestaurant, searchRestaurant, updateOrderStatus, updateRestaurant } from "../Controller/retaurant.controller.ts";




const router = Express.Router()
router.route('/').post(isAuthenticated,upload.single("imageFile"),createRestaurant)
router.route('/').get(isAuthenticated,getRestaurant)
// Update restaurant by id
router.route('/:id').put(isAuthenticated,upload.single("imageFile"),updateRestaurant)
router.route('/order').get(isAuthenticated,getRestaurantOrder)
router.route('/order/:orderId/status').put(isAuthenticated,updateOrderStatus)
// make search public (no auth required)
router.route('/search/:searchText').get(searchRestaurant)
router.route('/:id').get(isAuthenticated,getSingleRestaurant)
export default router
