import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/useUserStore";
import type { CheckoutSessionRequest } from "@/types/orderType";
import { useCartStore } from "@/store/useCartStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { useOrderStore } from "@/store/useOrderStore";
import axios from "axios";
import { Loader2 } from "lucide-react";



const CheckoutConfirmPage = ({ open, setOpen }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }) => {
    
    const { user } = useUserStore()
    const [input, setInput] = useState({
        name: user?.fullname || "",
        email: user?.email || "",
        contact: user?.contact.toString() || "",

        address: user?.address || "",
        city: user?.city || "",
        country: user?.country || ""

    })
    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value })

    }
    const { cart } = useCartStore()
    const {createCheckoutSession ,loading } = useOrderStore();
    const { restaurant } = useRestaurantStore()
    const checkoutHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // api implementation start from here
        try {
            if (!restaurant?._id) {
                alert("Restaurant not selected. Please go back and select a restaurant.")
                return
            }

            const checkoutData: CheckoutSessionRequest = {
                cartItems: cart.map((cartItem) => ({
                    menuId: cartItem._id,
                    name: cartItem.name,
                    image: cartItem.image,
                    price: Number(cartItem.price),
                    quantity: Number(cartItem.quantity),
                })),
                deliveryDetails: input,
                restaurantId: restaurant._id as string

            }
            console.debug('checkout payload', checkoutData)
            await createCheckoutSession(checkoutData)
        } catch (error) {
console.log(error)
        }

    }
    return (

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>Review your Order</DialogTitle>
                <DialogDescription className="text-xs">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo repellat eveniet ducimus dolorum blanditiis, obcaecati reiciendis laborum nesciunt dignissimos. Nam quas laborum dolorum debitis facere quidem repellat optio, ad voluptates.
                </DialogDescription>
                <form onSubmit={checkoutHandler} className="md:grid grid-cols-2 gap-2 space-y-1 md:space-y-0">
                    <div >
                        <Label> full name</Label>
                        <Input
                            type="text"
                            name="name"
                            value={input.name}
                            onChange={changeEventHandler} />
                    </div>
                    <div >
                        <Label> email</Label>
                        <Input
                            disabled
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler} />
                    </div>
                    <div >
                        <Label> Contact</Label>
                        <Input
                            type="text"
                            name="contact"
                            value={input.contact}
                            onChange={changeEventHandler} />
                    </div>
                    <div >
                        <Label> address</Label>
                        <Input
                            type="text"
                            name="address"
                            value={input.address}
                            onChange={changeEventHandler} />
                    </div>
                    <div >
                        <Label> City</Label>
                        <Input
                            type="text"
                            name="city"
                            value={input.city}
                            onChange={changeEventHandler} />
                    </div>
                    <div >
                        <Label> Country</Label>
                        <Input
                            type="text"
                            name="country"
                            value={input.country}
                            onChange={changeEventHandler} />
                    </div>
                    <DialogFooter className="col-span-2 pt-5">
                        {
                            loading ? (<Button type="submit" className="!bg-orange-400 w-full">
                                <Loader2
                                className="m-2 h-4 w-4 animate-spin"/>
                                please wait</Button>):(
                                    <Button type="submit" className="!bg-orange-400 w-full">contrinue to pay
                                    ment</Button>
                                )



                        }
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog>

    )
}

export default CheckoutConfirmPage  