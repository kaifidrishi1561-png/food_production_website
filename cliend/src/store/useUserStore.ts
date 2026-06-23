import {create} from "zustand"
import { createJSONStorage,persist } from "zustand/middleware"
import axios from "axios"
import type { LoginInputState, SignupInputState } from "@/schema/userSchema"
import { toast } from "sonner"
import VerifyEmail from "@/auth/VerifyEmail"
import ForgotPassword from "@/auth/ForgotPassword"
import ResetPassword from "@/auth/ResetPassword"
const API_END_POINT = "http://localhost:8000/api/v1/user"
axios.defaults.withCredentials = true
type User = {
    fullname:string;
    email:string;
    contact:string;
    address:string;
    city:string;
    country:string;
    profilePicture:string;
    admin:boolean;
    isVerified:boolean;
}
type UserState={
    user: User | null;
    isAuthenticated:boolean;
    isCheckingAuth:boolean;
    loading:boolean;
    signup:(input:SignupInputState)=>Promise<void>
    login:(input:LoginInputState)=>Promise<void>
    VerifyEmail:(verification:string)=>Promise<void>
    checkAuthentication:()=>Promise<void>
    logout:()=>Promise<void>
    ForgotPassword:(email:string)=>Promise<void>
    ResetPassword:(token:string,newPassword:string)=>Promise<void>
    updateProfile:(input:any)=>Promise<void>
}
export const useUserStore = create<UserState>()(persist((set)=>({
    user:null,
    isAuthenticated:false,
    isCheckingAuth:true,
    loading:false,

    // signup api implementation
    signup:async(input:SignupInputState)=>{
        try {
            set({loading:true})
            const response = await axios.post(`${API_END_POINT}/signup`,input,{
                headers:{
                    'content-Type':'application/json'
                }
            })
            if(response.data.success){
                console.log(response.data);
                toast.success(response.data.message);
                set({loading:false,user:response.data.user,isAuthenticated:true})
            }
        } catch (error:any) {
           toast.error(error.response?.data?.message || "something went wrong")
    set({loading:false})

        }
        
    },
    login:async (input:LoginInputState)=>{
        try {
            set({loading:true})
            const response = await axios.post(`${API_END_POINT}/login`,input,{
                headers:{
                    'content-Type':'application/json'
                }
            })
            if(response.data.success){
                console.log(response.data);
                toast.success(response.data.message);
                set({loading:false,user:response.data.user,isAuthenticated:true})
            }
        } catch (error:any) {
            toast.error(error.response?.data?.message || "something went wrong")
    set({loading:false})
        }

    },
    VerifyEmail: async(verificationCode:string)=>{
        try {
            set({loading:true});
            const response = await axios.post(`${API_END_POINT}/verify-email`,{verificationCode },{
                headers:{
                    'Content-type':'application/json'
                }
            })
            if (response.data.success){
                toast.success(response.data.message)
                set({loading:false,user:response.data.user,isAuthenticated:true})
            }
           
        } catch (error:any) {
                toast.success(error.response.data.message)

            set({loading:false})
            
        }
    },
    checkAuthentication:async()=>{
        try {
            set({isCheckingAuth:true})
            const response = await axios.get(`${API_END_POINT}/check-auth`);
            if(response.data.success){
                set({user:response.data.user,isAuthenticated:true,isCheckingAuth:false})
            }
        } catch (error) {
            set({loading:false,isAuthenticated:false,isCheckingAuth:false})
            
        }
    },
    logout:async()=>{
        try {
            set({loading:true});
            const response = await axios.post(`${API_END_POINT}/logout`)
            if(response.data.success){
                toast.success(response.data.message);
                set({loading:false,user:null,isAuthenticated:false})
            }
        } catch (error) {
            set({loading:false})
            
        }
    },
    ForgotPassword:async(email:string)=>{
            try {
                set({loading:true});
                const response = await axios.post(`${API_END_POINT}/forgot-password`,{email})
                if(response.data.success){
                    toast.success(response.data.message)
                    set({loading:false})
                }
            } catch (error:any) {
                toast.error(error.response?.data?.message)
                set({loading:false})
                
            }
    },
    ResetPassword:async(token:string,newPassword:string)=>{
        try {
            set({loading:true});
            const response = await axios.post(`${API_END_POINT}/reset-password/${token}`,{newPassword})
            if(response.data.success){
                toast.success(response.data.message)
                set({loading:false})
            }
        } catch (error:any) {
            toast.error(error.response?.data?.message)
                set({loading:false})
        }
    },
    updateProfile:async(input:any)=>{
        try {
            const response = await axios.put(`${API_END_POINT}/profile/update`,input,{
                headers:{
                    'Content-Type':'application/json'
                }
            });
            if(response.data.success){
                toast.success(response.data.message);
                set({user:response?.data?.user,isAuthenticated:true})
            }
        } catch (error) {
            // show error to user
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const err:any = error
            toast.error(err.response?.data?.message || "Failed to update profile")
        }
    }

}),
{
    name:"user-name",
    storage:createJSONStorage(()=>localStorage),
    partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
    })
}
))