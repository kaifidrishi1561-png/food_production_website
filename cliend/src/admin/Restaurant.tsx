import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { restaurantFormSchema, type RestaurantFormSchema } from "@/schema/restaurantSchema"
import { useRestaurantStore } from "@/store/useRestaurantStore"
import { Loader2 } from "lucide-react"
import { useEffect, useState, type FormEvent } from "react"

const Restaurant = () => {
    const [input,setInput] = useState<RestaurantFormSchema>({
        restaurantName:"", city:"", country:"", deliveryTime:0, cuisines:[], imageFile:undefined,
    })
    const [errors, setErrors] = useState<Partial<RestaurantFormSchema>>({})
    const {loading,restaurants,updateRestaurant,createRestaurant,getRestaurant} = useRestaurantStore()
    const [editingId, setEditingId] = useState<string | null>(null)

    const changeEventHandler = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value, type} = e.target;
        setInput({...input,[name]: type === "number" ? Number(value) : value})
    }

    const resetForm = ()=>{
        setInput({ restaurantName:"", city:"", country:"", deliveryTime:0, cuisines:[], imageFile:undefined })
        setErrors({})
        setEditingId(null)
    }

    const editClickHandler = (id:string)=>{
        const target = restaurants.find((r)=>r._id === id)
        if(!target) return
        setInput({
            restaurantName: target.restaurantName || "",
            city: target.city || "",
            country: target.country || "",
            deliveryTime: target.deliveryTime || 0,
            cuisines: target.cuisines ? target.cuisines.map((c:string)=>c) : [],
            imageFile: undefined,
        })
        setEditingId(id)
    }

    const submitHandler = async (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        const result = restaurantFormSchema.safeParse(input);
        if(!result.success){
            setErrors(result.error.flatten().fieldErrors as Partial<RestaurantFormSchema>)
            return
        }
        try {
            const formData = new FormData()
            formData.append("restaurantName",input.restaurantName)
            formData.append("city",input.city)
            formData.append("country",input.country)
            formData.append("deliveryTime",input.deliveryTime.toString())
            formData.append("cuisines",JSON.stringify(input.cuisines))
            if(input.imageFile){ formData.append("imageFile",input.imageFile) }

            if(editingId){
                await updateRestaurant(editingId, formData)   // purana data -> usi ko update
            }else{
                await createRestaurant(formData)              // naya data -> naya restaurant
            }
            resetForm()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getRestaurant()
    }, [])

    return (
        <div className="max-w-6xl mx-auto my-10">
            <h1 className="font-extrabold text-2xl mb-5">{editingId ? "Edit Restaurant" : "Add Restaurant"}</h1>
            <form onSubmit={submitHandler}>
                <div className="md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0">
                    <div>
                        <Label>Restaurant name</Label>
                        <Input type="text" name="restaurantName" value={input.restaurantName} onChange={changeEventHandler} placeholder="Enter your restaurant" />
                        {errors && <span className="text-xs font-medium !text-red-500">{errors.restaurantName}</span>}
                    </div>
                    <div>
                        <Label>city</Label>
                        <Input type="text" name="city" value={input.city} onChange={changeEventHandler} placeholder="Enter your city" />
                        {errors && <span className="text-xs font-medium !text-red-500">{errors.city}</span>}
                    </div>
                    <div>
                        <Label>country</Label>
                        <Input type="text" name="country" value={input.country} onChange={changeEventHandler} placeholder="Enter your country" />
                        {errors && <span className="text-xs font-medium !text-red-500">{errors.country}</span>}
                    </div>
                    <div>
                        <Label>Delivery time</Label>
                        <Input type="number" name="deliveryTime" value={input.deliveryTime} onChange={changeEventHandler} placeholder="Enter your delivery time" />
                        {errors && <span className="text-xs font-medium !text-red-500">{errors.deliveryTime}</span>}
                    </div>
                    <div>
                        <Label>Cuisines</Label>
                        <Input type="text" name="cuisines" value={input.cuisines} onChange={(e)=>{setInput({...input,cuisines:e.target.value.split(",")})}} placeholder="e.g momos biryani" />
                        {errors && <span className="text-xs font-medium !text-red-500">{errors.cuisines}</span>}
                    </div>
                    <div>
                        <Label>upload restaurant banner</Label>
                        <Input onChange={(e)=>{setInput({...input,imageFile:e.target.files?.[0] || undefined})}} type="file" accept="image/*" name="imageFile" />
                        {errors && <span className="text-xs font-medium !text-red-500">{errors.imageFile?.name}</span>}
                    </div>
                </div>
                <div className="my-5 w-fit flex gap-3">
                    {loading ? (
                        <Button disabled className="!bg-amber-600"><Loader2 className="mr-2 h-4 w-4 animate-spin"/> please wait</Button>
                    ) : (
                        <Button type="submit" className="!bg-amber-600">{editingId ? "update restaurant" : "add your new restaurant"}</Button>
                    )}
                    {editingId && <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>}
                </div>
            </form>

            <div className="mt-10">
                <h2 className="font-bold text-xl mb-4">Your Restaurants</h2>
                {restaurants.length === 0 && <p className="text-gray-500">No restaurants yet.</p>}
                <div className="grid md:grid-cols-2 gap-4">
                    {restaurants.map((r)=>(
                        <div key={r._id} className="border rounded-lg p-4 flex gap-4 items-center">
                            <img src={r.imageUrl} alt={r.restaurantName} className="w-20 h-20 object-cover rounded-md" />
                            <div className="flex-1">
                                <h3 className="font-semibold">{r.restaurantName}</h3>
                                <p className="text-sm text-gray-500">{r.city}, {r.country}</p>
                            </div>
                            <Button onClick={()=>editClickHandler(r._id)} className="!bg-amber-600">Edit</Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Restaurant