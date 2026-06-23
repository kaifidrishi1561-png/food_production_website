import  Express  from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.ts";
import { createCheckoutSession,getOrders, stripeWebhook } from "../Controller/order.controller.ts";
const router = Express.Router()
router.route("/").get(isAuthenticated,getOrders)
router.route("/checkout/create-checkout-session").post(isAuthenticated,createCheckoutSession)
router.route("/webhook").post(Express.raw({type:'application/json'}),stripeWebhook)
// router.post(
//   "/checkout/create-checkout-session",
//   (req,res,next)=>{
//     console.log("ROUTE BODY:", req.body);
//     next();
//   },
//   isAuthenticated,
//   createCheckoutSession
// );
export default router