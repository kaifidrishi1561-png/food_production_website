import type { Request,Response } from "express";
import mongoose from "mongoose";
import { Restaurant } from "../models/restaurant.model.ts";
import { Order } from "../models/order.model.ts";  
import { Menu } from "../models/menu.model.ts"
// import { QuicEndpoint } from "node:quic";
import Stripe from "stripe"

// create stripe client if key present
let stripe: Stripe | null = null
if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2026-04-22.dahlia' })
} else {
    console.warn('STRIPE_SECRET_KEY is not set; Stripe operations will fail until configured')
}
type CheckoutSessionRequest={
cartItems:{
    menuId:String;
    name:String;
    image:string;
    price:number;
    quantity:number
}[],
deliveryDetails:{
name:string;
email:string;
address:string;
city:string;
},
restaurantId:string
}
export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({ user: req.id as any}).populate('user').populate('restaurant');
        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const createCheckoutSession = async (req: Request, res: Response) => {
    // console.log("CONTROLLER KEY:", process.env.STRIPE_SECRET_KEY);
    console.log("BODY:", req.body);
    // defensive checks - if body is missing, log helpful debug info
    if (!req.body) {
        console.error('createCheckoutSession: request body is undefined')
        console.error('Headers:', req.headers)
        console.error('Content-Type header:', req.get('content-type'))
        console.error('Cookies:', (req as any).cookies)
        return res.status(400).json({ success: false, message: 'Request body missing or not parsed. Ensure Content-Type: application/json and express.json() middleware is enabled.' })
    }
    try {
        // console.log("BODY:", req.body);
        const checkoutSessionRequest: CheckoutSessionRequest = req.body;
        if (!checkoutSessionRequest?.restaurantId) {
            console.error('createCheckoutSession: restaurantId missing from request body', checkoutSessionRequest)
            return res.status(400).json({ success: false, message: 'restaurantId is required in request body' })
        }
        const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId).populate('menus');
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found."
            })
        };
        const order: any = new Order({
            restaurant: restaurant._id,
            user: req.id,
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems: checkoutSessionRequest.cartItems,
            status: "pending"
        });

        // line items - prefer restaurant.menus, fallback to querying Menu by cart ids
        let menuItems: any = (restaurant.menus as any) || [];
        if (!menuItems || menuItems.length === 0) {
            const ids = checkoutSessionRequest.cartItems.map((c) => new mongoose.Types.ObjectId(c.menuId as any));
            menuItems = await Menu.find({ _id: { $in: ids } });
        }
        console.debug('menuItems count', (menuItems || []).length)
        console.debug('cartItems', checkoutSessionRequest.cartItems)
        const lineItems = createLineItems(checkoutSessionRequest, menuItems);

        if (!stripe) {
            console.error('Stripe client not configured (missing STRIPE_SECRET_KEY)')
            return res.status(500).json({ success: false, message: 'Server misconfiguration: STRIPE_SECRET_KEY missing' })
        }

        let session
        try {
            session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['GB', 'US', 'CA']
            },
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/order/status`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
            metadata: {
                orderId: order._id.toString(),
                images: JSON.stringify(menuItems.map((item: any) => item.image))
            }
            });
        } catch (stripeError: any) {
//             console.log("LINE ITEMS:", lineItems);
// console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
            console.error('Stripe error creating session:', stripeError?.message || stripeError)
            return res.status(502).json({ success: false, message: 'Stripe error: ' + (stripeError?.message || 'unknown') })
        }
        if (!session.url) {
            return res.status(400).json({ success: false, message: "Error while creating session" });
        }
        await order.save();
        return res.status(200).json({
            session
        });
    }
     catch (error: any) {
    console.log("ACTUAL ERROR:", error);

    return res.status(500).json({
        message: error?.message || "Internal server error"
    });
}
}

export const stripeWebhook = async (req: Request, res: Response) => {
    let event;

    try {
        const signature = req.headers["stripe-signature"];

        // Construct the payload string for verification
        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET!;

        // Generate test header string for event construction
        const header = Stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret,
        });

        // Construct the event using the payload string and header
        event = Stripe.webhooks.constructEvent(payloadString, header, secret);
    } catch (error: any) {
        console.error('Webhook error:', error.message);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }

    // Handle the checkout session completed event
    if (event.type === "checkout.session.completed") {
        try {
            const session = event.data.object as Stripe.Checkout.Session;
            const order = await Order.findById(session.metadata?.orderId);

            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            // Update the order with the amount and status
            if (session.amount_total) {
                order.totalAmount = session.amount_total;
            }
            order.status = "confirmed";

            await order.save();
        } catch (error) {
            console.error('Error handling event:', error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    // Send a 200 response to acknowledge receipt of the event
    res.status(200).send();
};

export const createLineItems = (checkoutSessionRequest: CheckoutSessionRequest, menuItems: any) => {
    // 1. create line items
    const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find((item: any) => item._id.toString() === cartItem.menuId);
        if (!menuItem) throw new Error(`Menu item id not found`);

        return {
            price_data: {
                currency: 'inr',
                product_data: {
                    name: menuItem.name,
                    images: [menuItem.image],
                },
                unit_amount: menuItem.price * 100
            },
            quantity: cartItem.quantity,
        }
    })
    // 2. return lineItems
    return lineItems;
}