import type { CheckoutSessionRequest, OrderState } from "@/types/orderType";
import axios from "axios";
import { createJSONStorage, persist } from "zustand/middleware";
const API_END_POINT :string = "http://localhost:8000/api/v1/order"
axios.defaults.withCredentials=true
import {create} from "zustand"

export const useOrderStore = create<OrderState>()(persist((set=>({
    loading:false,
    orders:[],
        createCheckoutSession: async(checkoutSession:CheckoutSessionRequest)=>{
            
//         console.log("=========chekoutout==========")
//       console.log("STRIPE KEY:", import.meta.env.STRIPE_SECRET_KEY);
// console.log("FRONTEND_URL:", import.meta.env.FRONTEND_URL);



        try {
//             console.log("REQUEST BODY:", req.body);
// console.log("RESTAURANT ID:", req.body?.restaurantId);
            
            set({loading:true});
            const response = await axios.post(`${API_END_POINT}/checkout/create-checkout-session`,checkoutSession,{
                headers:{
                    'Content-Type' :'application/json'
                }
            })
            window.location.href = response.data.session.url
            set({loading:false})




//             console.log("SENDING DATA:", checkoutSession);

// const response = await axios.post(
//   `${API_END_POINT}/checkout/create-checkout-session`,
//   checkoutSession,
//   {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   }
// );
        } catch (error) {
            set({loading:false})
        }
    },
    getOrderDetails:async()=>{
        try {
            set({loading:true})
            const response = await axios.get(`${API_END_POINT}/`)
            set({loading:false,orders:response.data.orders})
        } catch (error) {
            set({loading:false})
        }
    }

})),{
    name:"order-name",
    storage:createJSONStorage(()=>localStorage)
}))