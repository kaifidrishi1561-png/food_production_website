import React, { memo } from 'react'
import { Card, CardContent, CardFooter } from './ui/card'
import { IndianRupee } from 'lucide-react'
import { Button } from './ui/button'
import type { MenuItem } from '@/types/restaurantTypes'
import { useCartStore } from '@/store/useCartStore'
import { useNavigate } from 'react-router-dom'

type Props = {}

const AvailableMenu = ({menus}:{menus:MenuItem[]}) => {
    const {addToCart} = useCartStore()
const navigate = useNavigate()
  return (
    <div className='md:p-4'>
        <h1 className='text-xl md:text-2xl font-extrabold mb-6'>AvailableMenu</h1>
        <div className='grid md:grid-cols-3 space-y-4 md:space-y-0'>
            { menus.map((menu:MenuItem)=>(
  <Card key={menu._id} className='max-w-xs mx-auto shadow-lg rounded-lg overflow-hidden'>
                <img className='w-full h-40 object-cover' src={menu.image} alt="" />
                <CardContent>
                    <h2 className='text-xl font-semibold text-gray-500 dark:text-white' >{menu.name}</h2>
                    <p className='text-sm text-gray-600 mt-2'>{menu.description}</p>
                    <h3 className='flex'> 
                        
                        Price:  <span className='text-xl flex font-bold'><IndianRupee className=''/>{menu.price}</span>
                    </h3>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => {
                        addToCart(menu)
                        navigate("/cart")
                    }} className={"!bg-amber-300 w-full"}>Add to Card</Button>
                </CardFooter>

            </Card>
            ))
            }
          
        </div>
    </div>
  )
}
export default AvailableMenu