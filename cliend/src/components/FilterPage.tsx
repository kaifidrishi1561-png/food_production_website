
import { Option } from "lucide-react";
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { useRestaurantStore } from "@/store/useRestaurantStore";
export type FilterOptionsState = {
    id:string;
    label:string
}[];
// agar applied filter ka ander ye item exit karta ha to iska matlab cheked ha
const filterOptions:FilterOptionsState =[
    {id:"burger",label:"Burger"},
    {id:"thali",label:"Thali"},
    {id:"biryani",label:"Biryani"},
    {id:"momos",label:"Momos"}
]
const FilterPage = () => {
const {setAppliedFilter,appliedFilter ,resetAppliendFilter} = useRestaurantStore()
   const appliedFilterHandler =(value:string)=>{
setAppliedFilter(value)
   } 
  return (
    <div className="md:w-72 ">
        <div className="flex items-center justify-between">
            <h1 className="font-medium text-lg">filter by cuisin</h1>
            <Button variant={"link"} onClick={resetAppliendFilter}>Reset</Button>

        </div>
        {
            filterOptions.map((option)=>(
                <div key={option.id} className="flex items-center space-x-2 my-5">
                    <Checkbox
                    id={option.id}
                    checked={appliedFilter.includes(option.label)}
                    onClick={()=>appliedFilterHandler(option.label)}/>
                    <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{option.label}</Label>
                </div>
            ))
        }

    </div>
  )
}
export default FilterPage