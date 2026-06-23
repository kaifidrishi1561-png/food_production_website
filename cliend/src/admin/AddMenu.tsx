import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus } from "lucide-react"
import type { Orders } from "@/types/orderType";
import { useState, type FormEvent } from "react"
import imagehero from "@/assets/hero_pizza.png"
import EditMenu from "./EditMenu"
import { MenuSchema, type MenuFormSchema } from "@/schema/MenuSchema"
import { useMenuStore } from "@/store/useMenuStore"
import { useRestaurantStore } from "@/store/useRestaurantStore"
const menus = [
    {
    name:"Biryani",
    describtion:"loren jh hjkhjh jh jh hkh k ",
    price:80,
    image:imagehero
},
    {
    name:"Biryani",
    describtion:"loren jh hjkhjh jh jh hkh k ",
    price:80,
    image:imagehero
},
]



const AddMenu = () => {
  const [input, setInput] = useState<MenuFormSchema>({
    name: "",
    describtion: "",
    price: 0,
    image: undefined,
  });
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<any>();
  const [error, setError] = useState<Partial<MenuFormSchema>>({});
  const { loading, createMenu } = useMenuStore();
  const {restaurant} = useRestaurantStore();

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      const result = MenuSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setError(fieldErrors as Partial<MenuFormSchema>);
      return;
    }
    // api ka kaam start from here
    try {
      const formData = new FormData();
      formData.append("name", input.name);
      // server expects the field name 'describtion'
      formData.append("describtion", input.describtion);
      formData.append("price", input.price.toString());
      if(input.image){
        formData.append("image", input.image);
      }
      await createMenu(formData);
      // reset form and close dialog on success
      setInput({ name: "", describtion: "", price: 0, image: undefined });
      setError({});
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
   
  };
  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="flex justify-between">
        <h1 className="font-bold md:font-extrabold text-lg md:text-2xl">
          Available Menus
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger >
            <Button className="bg-red-400 hover:bg-hoverOrange">
              <Plus className="mr-2" />
              Add Menus
            </Button>
          </DialogTrigger>
            
            
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add A New Menu</DialogTitle>
              <DialogDescription>
                Create a menu that will make your restaurant stand out.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                  placeholder="Enter menu name"
                />
                {error.name && (
                  <span className="text-xs font-medium text-red-600">
                    {Array.isArray(error.name) ? error.name[0] : error.name}
                  </span>
                )}
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  type="text"
                  name="describtion"
                  value={input.describtion}
                  onChange={changeEventHandler}
                  placeholder="Enter menu description"
                />
                {error.describtion && (
                  <span className="text-xs font-medium text-red-600">
                    {Array.isArray(error.describtion) ? error.describtion[0] : error.describtion}
                  </span>
                )}
              </div>
              <div>
                <Label>Price in (Rupees)</Label>
                <Input
                  type="number"
                  name="price"
                  value={input.price}
                  onChange={changeEventHandler}
                  placeholder="Enter menu price"
                />
                {error.price && (
                  <span className="text-xs font-medium text-red-600">
                    {Array.isArray(error.price) ? error.price[0] : error.price}
                  </span>
                )}
              </div>
              <div>
                <Label>Upload Menu Image</Label>
                <Input
                  type="file"
                  name="image"
                  onChange={(e) =>
                    setInput({
                      ...input,
                      image: e.target.files?.[0] || undefined,
                    })
                  }
                />
                {error.image && (
                  <span className="text-xs font-medium text-red-600">
                    {Array.isArray(error.image) ? error.image[0] : String(error.image)}
                  </span>
                )}
              </div>
              <DialogFooter  className="mt-5">
                
                {loading ? (
                  <Button  disabled className="bg-red-400 ">
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button type="submit" className="bg-red-400  ">
                    Submit
                  </Button>
                )}
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {restaurant?.menus.map((menu: any, idx: number) => (
        <div key={idx} className="mt-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 md:p-4 p-2 shadow-md rounded-lg border">
            <img
              src={menu.image}
              alt=""
              className="md:h-24 md:w-24 h-16 w-full object-cover rounded-lg"
            />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-800">
                {menu.name}
              </h1>
              <p className="text-sm tex-gray-600 mt-1">{menu.describtion}</p>
              <h2 className="text-md font-semibold mt-2">
                Price: <span className="text-[#D19254]">{menu.price}</span>
              </h2>
            </div>
            <Button
              onClick={() => {
                setSelectedMenu(menu);
                setEditOpen(true);
              }}
              size={"sm"}
              className="bg-orange hover:bg-hoverOrange mt-2"
            >
              Edit
            </Button>
          </div>
        </div>
      ))}
      <EditMenu
        selectedMenu={selectedMenu}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
      />
    </div>
  );
};

export default AddMenu;
