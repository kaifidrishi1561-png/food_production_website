export type MenuItem ={
    _id:string;
    name:string;
    description:string;
    price:number;
    image:string;
}
export type Restaurant = {
    _id:string;
    user:string;
    restaurantName:string;
    city:string;
    country:string;
    deliveryTime:number;
    cuisines:string[];
    menus:MenuItem[];
    imageUrl:string;

}

 export type SearchedRestaurant = {
    data:Restaurant[]
}
import type { Orders } from "@/types/orderType";
 export type RestaurantState={
    loading:boolean;
        restaurant: Restaurant | null;
        // ssssss
        restaurants:Restaurant[];
        searchedRestaurant:SearchedRestaurant | null;
        appliedFilter:string[];
        createRestaurant:(formData:FormData)=>Promise<void>;
        getRestaurant:()=>Promise<void>;
        singleRestaurant : Restaurant |null;
        updateRestaurant:(restaurantId:string,formData:FormData)=>Promise<void>;
        searchRestaurant:(searchText:string,searchQuery:string,selectedCuisines:any)=>Promise<void>;
        addMenuToRestaurant:(menu:any)=>void;
        updateMenuToRestaurant:(menu:any)=>void;
        setAppliedFilter:(value:string)=>void;
        resetAppliendFilter:()=>void;
        restaurantOrder:Orders[];
        getRestaurantOrders:()=>Promise<void>
        getSingleRestaurant:(restaurantId:string)=>Promise<void>
        updateRestaurantOrder:(orderId:string,status:string)=>Promise<void>

}