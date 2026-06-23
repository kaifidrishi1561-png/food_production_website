import { Link } from "react-router-dom"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Menubar,
    MenubarTrigger,
    MenubarContent,
    MenubarMenu,
    MenubarItem
} from "@/components/ui/menubar"
import { Button } from "@/components/ui/button"

import { HandPlatter, Loader2, Menu, Moon, PackageCheck, ShoppingCart, SquareMenu, Sun, User, UtensilsCrossed } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator" // base-ui ki jagah shadcn separator select kiya hai text design ke liye

import { useUserStore } from "@/store/useUserStore"
import { useCartStore } from "@/store/useCartStore"
import { useThemeStore } from "@/store/useThemeStore"


const Navbar = () => {
      const {setTheme} = useThemeStore()
    const{user,loading,logout} = useUserStore()
    const{cart =[]} = useCartStore()
  

    return (
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-14">
                <Link to={"/"} >
                    <h1 className="font-bold md:font-extrabold text-2xl">pateleats</h1>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10">
                    <div className="hidden md:flex items-center gap-6 ">
                        <Link to={"/"} className="hover:text-red-600 transition-colors">home</Link>
                        <Link to={"/profile"} className="hover:text-red-600 transition-colors">profile</Link>
                        <Link to={"/order/status"} className="hover:text-red-600 transition-colors">Order</Link>

                        {user?.admin && (
                            <Menubar>
                                <MenubarMenu>
                                    <MenubarTrigger className="cursor-pointer">
                                        dashboard
                                    </MenubarTrigger>
                                    <MenubarContent>
                                        <Link to={"/admin/restaurant"}>
                                            <MenubarItem className="cursor-pointer">restaurant</MenubarItem>
                                        </Link>
                                        <Link to={"/admin/menu"}>
                                            <MenubarItem className="cursor-pointer">menu</MenubarItem>
                                        </Link>
                                        <Link to={"/admin/orders"}>
                                            <MenubarItem className="cursor-pointer">orders</MenubarItem>
                                        </Link>
                                    </MenubarContent>
                                </MenubarMenu>
                            </Menubar>
                        )}
                    </div>

                    <div className="items-center flex gap-4">
                        {/* Theme Toggle */}
                        <div>
                            <DropdownMenu>
                                                {/* use render prop to avoid nested <button> elements */}
                                                <DropdownMenuTrigger
                                                    render={
                                                        <Button variant="outline" size="icon">
                                                            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                                                            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                                                            <span className="sr-only">Toggle theme</span>
                                                        </Button>
                                                    }
                                                />
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={()=>setTheme('light')} className="cursor-pointer">
                                        Light
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={()=>setTheme('dark')} className="cursor-pointer">
                                        Dark
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Cart */}
                        <Link to="/cart" className="relative cursor-pointer">
                            <ShoppingCart />
                            {
                                cart.length >0 && <Button size={"icon"} className="absolute -top-2 -right-2 text-[10px] rounded-full h-4 w-4 text-white bg-red-600 hover:bg-red-700">
                                {cart.length}</Button>
                            }
                            
                        </Link>

                        {/* User Avatar */}
                        <div>
                            <Avatar>
                                <AvatarImage src={user?.profilePicture} alt="profilephoto" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Auth Button */}
                        <div>
                            {loading ? (
                                <Button  className='bg-blue-600 hover:bg-blue-700'>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait
                                </Button>
                            ) : (
                                <Link to={'/'}>
                                <Button onClick={logout}     className='!bg-blue-600 hover:bg-blue-700'>Logout</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Responsive Menu */}
                <div className="md:hidden">
                    <MobileNavbar />
                </div>
            </div>
        </div>
    )
}
export default Navbar

const MobileNavbar = () => {
    const {user ,logout,loading} =useUserStore()
    const {setTheme} = useThemeStore()
    return (
        <Sheet>
            {/* ✅ asChild fixed here */}

                        <SheetTrigger
                            render={
                                <Button size={'icon'} className="rounded-full text-black bg-green-400 hover:bg-green-500" variant="outline">
                                    <Menu size={'18'} />
                                </Button>
                            }
                        />
            <SheetContent className='flex flex-col'>
                <SheetHeader className="flex flex-row items-center justify-between mt-2">
                    <SheetTitle>patelsEats</SheetTitle>
                    <DropdownMenu>
                                                {/* use render prop to avoid nested <button> elements */}
                                                <DropdownMenuTrigger
                                                    render={
                                                        <Button variant="outline" size="icon">
                                                            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                                                            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                                                            <span className="sr-only">Toggle theme</span>
                                                        </Button>
                                                    }
                                                />
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={()=>setTheme('light')} className="cursor-pointer">
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={()=>setTheme('dark')} className="cursor-pointer">
                                Dark
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SheetHeader>

                <Separator className='my-2' />

                <SheetDescription className="flex-1 flex flex-col gap-2">
                    <Link to={'/profile'} className="flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium transition-colors">
                        <User />
                        <span>Profile</span>
                    </Link>
                    <Link to={'/order/status'} className="flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium transition-colors">
                        <HandPlatter />
                        <span>Order</span>
                    </Link>
                    <Link to={'/cart'} className="flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium transition-colors">
                        <ShoppingCart />
                        <span>Cart (0)</span>
                    </Link>
                        {
                            user?.admin && (
                                <>
                                 <Link to={'/admin/menu'} className="flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium transition-colors">
                        <SquareMenu />
                        <span>Menu</span>
                    </Link>
                    <Link to={'/admin/restaurant'} className="flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium transition-colors">
                        <UtensilsCrossed />
                        <span>Restaurant</span>
                    </Link>
                    <Link to={'/admin/orders'} className="flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium transition-colors">
                        <PackageCheck />
                        <span>Restaurant Order</span>
                    </Link>
                                </>
                            )
                        }
                   
                </SheetDescription>

                <SheetFooter className="flex flex-col gap-4 mt-auto">
                    <div className="flex flex-row items-center gap-2">
                        <Avatar>
                            <AvatarImage src={user?.profilePicture} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <h1 className="font-bold text-gray-900 dark:text-gray-100">patel mernstack</h1>
                    </div>

                                        <SheetClose
                                            render={
                                                loading ? (
                                                    <Button className="bg-blue-600 hover:bg-blue-700" disabled>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait
                                                    </Button>
                                                ) : (
                                                    <Link to={'/'}>
                                                        <Button onClick={logout} className='!bg-blue-600 hover:bg-blue-700'>Logout</Button>
                                                    </Link>
                                                )
                                            }
                                        />
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}