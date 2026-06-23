import express from "express"
import dotenv from 'dotenv'
import connectDB from "./db/connectDB.ts"
import userRoute from './routes/user.route.ts'
import restaurantRoute from './routes/restaurant.route.ts'
import { stripeWebhook } from './Controller/order.controller.ts'
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import menuRoute from "./routes/menu.route.ts"
import orderRoute from "./routes/order.route.ts"


dotenv.config();
// console.log("ENV CHECK:", process.env.STRIPE_SECRET_KEY);
const app =  express()
const PORT = process.env.PORT || 8000 
// default middlware for any mern project
// app.use(bodyParser.json({limit:'10mb'}))
app.use(express.urlencoded({extended:true}))

// Stripe requires the raw request body for webhook signature verification.
// Register the webhook route with `express.raw()` before the JSON body parser.
app.post('/api/v1/order/webhook', express.raw({ type: 'application/json' }), stripeWebhook)

app.use(express.json())
app.use(cookieParser())
const corsOptions ={
    origin:"http://localhost:5173",
    credentials:true
}
app.use(cors(corsOptions))
//api
app.use("/api/v1/user",userRoute)
app.use("/api/v1/restaurant",restaurantRoute)
app.use("/api/v1/menu",menuRoute)
app.use("/api/v1/order",orderRoute)
// validate required env vars early
const requiredEnv = ["MONGO_URI", "SECRET_KEY", "FRONTEND_URL", "STRIPE_SECRET_KEY"]
const missing = requiredEnv.filter(key => !process.env[key])
if (missing.length) {
    console.error('Missing required environment variables:', missing.join(', '))
    console.error('Create a .env with MONGO_URI, SECRET_KEY, FRONTEND_URL, STRIPE_SECRET_KEY')
    // do not start server when critical config is missing
    process.exit(1)
}

app.listen(PORT,() => {
    connectDB().then(()=>{
        console.log(`Server is running on port ${PORT}`)
    }).catch(err=>{
        console.error('Failed to connect to DB on startup', err)
        process.exit(1)
    })
})