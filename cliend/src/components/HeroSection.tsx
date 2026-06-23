import { Search } from "lucide-react"
import { Input } from "./ui/input"
import { useState } from "react"
import { Button } from "./ui/button"
import image from "../assets/hero_pizza.png"
import { useNavigate } from "react-router-dom"
const HeroSection = () => {
    const [searchText, setsearchText] = useState<string>("")
    const navigate = useNavigate()
    return (
        <div className="flex flex-col md:flex-row max-w-7xl mx-auto md:p-10 rounded-lg items-center justify-center m-4 gap-20">
            <div className="flex flex-col gap-10 md:[40%]">
                <div className="font-bold md:font-extrabold md:text-5xl text-4xl">
                    <h1 className="font-bold md:font-extrabold md:text-5xl text-4xl">order food anytime <br/> & anywhere</h1>
                </div>
                    <p className="text-gray-500">this is my food deleveriy so if you won't so idon't won't give you sorry pagal</p>
                <div className=" relative  flex items-center w-full gap-2">
                  

                <Input
                type="text"
                className="pl-10   shadow-xl"
                value={searchText}
                placeholder="search by resturant"
                onChange={(e)=>{setsearchText(e.target.value)}}/>
                <Search className="text-gray-300 absolute  inset-y-2 left-3"  />
                
                <Button onClick={()=>navigate(`/search/${searchText}`)} className='!bg-amber-400 hover:!bg-amber-600'>submit</Button>
                </div>
            </div>
            <div>
                <img src={image} alt="image"
                className="object-cover w-full max-h-[500px] "
                 />
            </div>
            
        </div>
    )
}

export default HeroSection