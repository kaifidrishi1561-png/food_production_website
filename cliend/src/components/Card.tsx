
    import { Button } from "./ui/button"
    import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./ui/table"
    import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "./ui/avatar"
    import { Minus, Plus } from "lucide-react"
    import type { number } from "zod"

    import { useState } from "react"
    import CheckoutConfirmPage from "./CheckoutConfirmPage"
    import { useCartStore } from "@/store/useCartStore"
    import type { MenuItem } from "@/types/restaurantTypes"
    import type { CartItem, CartState } from "@/types/cartType"



    const Card = () => {
        const [open ,setOpen] = useState<boolean>(false)
        const {cart,decrementQuantity,incrementQuantity,removeFromTheCart,clearCart} = useCartStore()
        let totalAmount = cart.reduce((acc,ele)=>{
            return acc + ele.price * ele.quantity
        },0)
    return (
        <div className="flex flex-col max-w-7xl mx-auto my-10">
            <div className="flex justify-end">
                <Button variant="link" onClick={() => clearCart()}>Clear all</Button>
            </div>

                <Table className="">
                    <TableHeader>
                        <TableRow>
                            <TableHead>items</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead className="text-right">remove</TableHead>
                            
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            cart.map((item:CartItem)=>(
                                    <TableRow key={item._id}>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage src={item.image} alt=""/>
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>
                                <div className="w-full flex items-center rounded-full border border-green-100 dark:border-gray-800 shadow-md">
                                    <Button size={"icon"} variant={'outline'} className="rounded-full bg-gray-200"
                                    onClick={()=>decrementQuantity(item._id)}>
                                        <Minus/></Button>
                                    <div className="px-4 font-bold">{item.quantity}</div>
                                    <Button size={'icon'}  
                                    onClick={()=>incrementQuantity(item._id)} variant={'outline'} className={'!bg-orange-400 rounded-full'}>
                                        <Plus/>
                                    </Button>

                                </div>
                            </TableCell>
                            <TableCell>{item.price * item.quantity}</TableCell>
                            <TableCell className="text-right">
                                <Button className={'!bg-orange-500 '} size={'sm'} onClick={()=>removeFromTheCart(item._id)}>Remove</Button>
                            </TableCell>

                            </TableRow>  
                            ))
                        }
                    
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={5}>Total</TableCell>
                            <TableCell className="text-right">{totalAmount}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
                <div className="flex  justify-end my-5">
                    <Button onClick={()=>setOpen(true)} className={'!bg-gray-600'}> Process to checkout</Button>

                </div>
                <CheckoutConfirmPage open={open} setOpen={setOpen}/>

        </div>
    )
    }
    export default Card