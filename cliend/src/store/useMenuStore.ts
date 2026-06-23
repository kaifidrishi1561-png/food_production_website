import loading from "@/components/Loading"
import axios from "axios"
import { toast } from "sonner"
import {create} from "zustand"
import { createJSONStorage,persist } from "zustand/middleware"
import { useRestaurantStore } from "./useRestaurantStore"
const API_END_POINT = "http://localhost:8000/api/v1/menu"
axios.defaults.withCredentials=true
type MenuState={
    loading:boolean,
    menu:null,
    createMenu:(formdata:FormData)=>Promise<void>;
    editMenu:(menuId:string,formdata:FormData)=>Promise<void>;
}
export const useMenuStore = create<MenuState>()(persist((set)=>({
    loading:false,
    menu:null,
    createMenu:async(formData:FormData)=>{
        try {
            set({loading:true})
            const response = await axios.post(`${API_END_POINT}/`,formData,{
                headers:{
                    "content-Type":"multipart/form-data"
                }
            })
            if(response.data.success){
                toast.success(response.data.message)
                set({loading:false,menu:response.data.menu})
                // update restaurant
                useRestaurantStore.getState().addMenuToRestaurant(response.data.menu)
                return
            }
            set({loading:false})
        } catch (error:any) {
            const msg = error?.response?.data?.message || error?.message || "Something went wrong"
            try { toast.error(msg) } catch (_) {}
            set({loading:false})
        }
    },
    editMenu:async(menuId:string,formData:FormData)=>{
        try {
            set({loading:true})
            const response =  await axios.put(`${API_END_POINT}/${menuId}`,formData,{
                headers:{
                    'content-Type':"multipart/form-data"
                }
            })
            if(response.data.success){
                toast.success(response.data.message)
                set({loading:false,menu:response.data.menu})
                // update restaurant menu
                useRestaurantStore.getState().updateMenuToRestaurant(response.data.menu)
                return
            }
            set({loading:false})
        } catch (error:any) {
                 const msg = error?.response?.data?.message || error?.message || "Something went wrong"
                 try { toast.error(msg) } catch(_) {}
            set({loading:false})
        }
     },
     getMenu: async (menuId: string) => {
    try {
        set({ loading: true });

        const response = await axios.get(
            `${API_END_POINT}/${menuId}`
        );

        if (response.data.success) {
            set({
                loading: false,
                menu: response.data.menu
            });
        }
    } catch (error: any) {
        const msg = error?.response?.data?.message || error?.message || "Something went wrong"
        try { toast.error(msg) } catch(_) {}
        set({ loading: false });
    }
},

}),
{
    name:"menu-name",
    storage:createJSONStorage(()=> localStorage)
}
))