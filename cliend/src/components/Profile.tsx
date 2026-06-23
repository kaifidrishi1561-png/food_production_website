import { Loader2, Mail, MapPin, MapPinIcon, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRef, useState, type FormEvent } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/useUserStore";

const Profile = () => {
  const {user,updateProfile } =useUserStore()
  const [isloading,setIsLoading] = useState<boolean>(false);
  const [profileData, setProfileData] = useState({
    fullname: user?.fullname || "",
    email:user?.email ||  "",
    address: user?.address || "",
    city:user?.city ||  "",
    country: user?.country || "",
    profilePicture:user?.profilePicture ||  "",
  });

  const imageRef = useRef<HTMLInputElement | null>(null);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>(profileData.profilePicture ||"");

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setSelectedProfilePicture(result);
        setProfileData((prevData) => ({
          ...prevData,
          profilePicture: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
    
  };

  const updateProfileHandler = async (e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault()

    try {
      setIsLoading(true)
      await updateProfile(profileData)
      setIsLoading(false)
    } catch (error:any) {
      setIsLoading(false)
    }
  }



  return (
    <form onSubmit={updateProfileHandler} className="max-w-7xl mx-auto my-5 px-4">
      {/* Avatar & Name Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="relative md:w-28 md:h-28 w-20 h-20">
            <AvatarImage src={selectedProfilePicture} alt="Profile" className="object-cover" />
            <AvatarFallback>CN</AvatarFallback>

            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={fileChangeHandler}
            />

            <div
              onClick={() => imageRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-full cursor-pointer z-10"
            >
              <Plus className="text-white w-8 h-8" />
            </div>
          </Avatar>
          
          <Input
            type="text"
            value={profileData.fullname}
            name="fullname"
            placeholder="Your Full Name"
            onChange={changeHandler}
            className="font-bold text-2xl outline-none border-none focus-visible:ring-transparent"
          />
        </div>
      </div>

      {/* Form Fields Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 w-full gap-6 my-10">
        {/* Email */}
        <div className="flex items-center gap-4 w-full border rounded-md p-2">
          <Mail className="text-gray-500 shrink-0" />
          <div className="w-full">
            <Label className="text-xs text-gray-400">Email</Label>
            <input
            disabled
              name="email"
              type="email"
              value={profileData.email}
              onChange={changeHandler}
              className="w-full text-gray-600 bg-transparent outline-none border-none text-sm"
            />
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center gap-4 border rounded-md p-2">
          <MapPin className="text-gray-500 shrink-0" />
          <div className="w-full">
            <Label className="text-xs text-gray-400">Address</Label>
            <input
              name="address"
              type="text"
              value={profileData.address}
              onChange={changeHandler}
              className="w-full text-gray-600 bg-transparent outline-none border-none text-sm"
            />
          </div>
        </div>

        {/* City */}
        <div className="flex items-center gap-4 border rounded-md p-2">
          <MapPin className="text-gray-500 shrink-0" />
          <div className="w-full">
            <Label className="text-xs text-gray-400">City</Label>
            <input
              name="city"
              type="text"
              value={profileData.city}
              onChange={changeHandler}
              className="w-full text-gray-600 bg-transparent outline-none border-none text-sm"
            />
          </div>
        </div>

        {/* Country */}
        <div className="flex items-center gap-4 border rounded-md p-2">
          <MapPinIcon className="text-gray-500 shrink-0" />
          <div className="w-full">
            <Label className="text-xs text-gray-400">Country</Label>
            <input
              name="country"
              type="text"
              value={profileData.country}
              onChange={changeHandler}
              className="w-full text-gray-600 bg-transparent outline-none border-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        {isloading ? (
          <Button disabled className="bg-red-500 hover:bg-red-600">
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit" className="!bg-red-500 hover:bg-red-600 text-white">
            Update Profile
          </Button>
        )}
      </div>
    </form>
  );
};

export default Profile;