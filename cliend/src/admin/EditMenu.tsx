import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MenuSchema, type MenuFormSchema } from "@/schema/MenuSchema"
import { useMenuStore } from "@/store/useMenuStore"
import { Loader2 } from "lucide-react"
import { useEffect, useState, type Dispatch, type FormEvent, type SetStateAction } from "react"

const EditMenu =  ({ selectedMenu, editOpen, setEditOpen }: { selectedMenu: any, editOpen: boolean, setEditOpen: Dispatch<SetStateAction<boolean>> }) => {
     const [input , setInput] = useState<MenuFormSchema>({
            name:"",
        describtion:"",
        price:0,
        image:undefined
        })
        const changeEventHandler = (e:React.ChangeEvent<HTMLInputElement>)=>{
            const {name,value ,type} = e.target
            setInput({...input,[name]:type === 'number'?Number(value):value})

        }
         const { loading, editMenu } = useMenuStore()
const [error,setError]=useState<Partial<MenuFormSchema>>({})


    const submitHandler = async (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
         const result = MenuSchema.safeParse(input)
                if(!result.success){
                    const FieldErrors = result.error.flatten(   ).fieldErrors 
                    setError(FieldErrors as Partial<MenuFormSchema>)
                    return;
                }
               
       // api start here
        try {
            const formData =    new FormData();
            formData.append("name",input.name)
            formData.append("describtion",input.describtion)
            formData.append("price",input.price.toString())
            if(input.image){
                formData.append("image",input.image)
            }
            await editMenu(selectedMenu._id,formData)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        setInput({
             name:selectedMenu?.name  || "",
        describtion:selectedMenu?.describtion || "",
        price:selectedMenu?.price || 0,
        image:undefined
        })
    },[selectedMenu])
    return (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Menu </DialogTitle>
                    <DialogDescription>
                        Update Your menu to keep your offerrings fresh and exiting
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submitHandler} action="" className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input
                        type="text"
                        value={input.name}
                        onChange={changeEventHandler}
                        name="name"
                        placeholder="enter the  menu name"/>
                        {error && <span className="text-xs font-medium !text-red-600"> {error.name}</span>}

                    </div>
                    <div>
                        <Label>Describtion</Label>
                        <Input
                        type="text"
                         name="describtion"
                        onChange={changeEventHandler}
                        value={input.describtion}
                        placeholder="enter menu  describtion"/>
                        {error && <span className="text-xs font-medium !text-red-600"> {error.describtion}</span>}

                    </div>
                    <div>
                        <Label>Price in (rupees)</Label>
                        <Input
                        type="number"
                        name="price"
                         value={input.price}
                        onChange={changeEventHandler}
                        placeholder="enter menu price"/>
                        {error && <span className="text-xs font-medium !text-red-600"> {error.price}</span>}

                    </div>
                    <div>
                        <Label>Upload menu image</Label>
                        <Input
                        type="file"
                        name="image"
                         onChange={(e)=>{setInput({...input,image:e.target.files?.[0] || undefined})}}
                         />
                        {error && <span className="text-xs font-medium !text-red-600"> {error.image?.name}</span>}


                    </div>
                        <DialogFooter className="mt-5">
                            {
                                loading ?(<Button disabled className={'!bg-orange-500'}>
                                    <Loader2 className="m-2 h-4 w-4 animate-none"/>please  wait
                                </Button>):( <Button type="submit" className={'!bg-orange-500 w-full'}>Submit</Button>)
                            }
                           
                        </DialogFooter>
                </form>
            </DialogContent>

        </Dialog>
    )
}

export default EditMenu