// tsrafce  
import  Login from "./Login"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { userSignupSchema, type SignupInputState } from "@/schema/userSchema";
import { Separator } from "@base-ui/react";
import { Contact,  Loader2, LockKeyhole, Mail, PhoneOutgoing, User } from "lucide-react"
import { Link, useNavigate  } from "react-router-dom";
import { useState } from "react";

import type { FormEvent } from "react"

import { useUserStore } from "@/store/useUserStore";

// interface SignupInputState {
//     fullname:String;
// email: string;
// password: string;
// contect:String;
// }
const Signup = () => {
    
    const {signup,loading} = useUserStore()
    const Navigate = useNavigate()
    const [input, setInput] = useState<SignupInputState>({
        fullname:"",
        email: "",
        password: "",
        contact:""
    })
    const [errors, setErrors] = useState<Partial<SignupInputState>>({})
    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name,value} = e.target;
        setInput({...input,[name]:value})
    }
    const loginSubmitHandler =async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        // form validation check
        const result = userSignupSchema.safeParse(input);
        if(!result.success){    
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors(fieldErrors as Partial<SignupInputState>);
            return;
        }
    console.log(input)
    // login api implementation start here
try {
    
    await signup(input);
    Navigate("/verify-email")
} catch (error) {
    console.log(error)
}
    }
        


    return (
        <div className='min-h-screen flex items-center justify-center'   >
            <form onSubmit={loginSubmitHandler} action="" className='md:p-8 w-full max-w-md md:border border-gray-200 rounded-lg mx-4'>
                <div className=' mb-4 items-center justify-center text-center   '>
                    <h1 className='text-2xl font-bold text-black'>PatelEats</h1>
                </div>
               <div className='mb-4'>
                 <div className='relative'>
                    <Input
                    type="text"
                    value={input.fullname}
                    onChange={changeEventHandler}
                    name="fullname"
                       
                        placeholder="Full Name" className='pl-10 focus-visible:ring-1'
                    />
                    <User className='absolute inset-y-2 left-2 text-gray-500 pointer-events-none ' />
                    {errors.fullname && <span className='size-max text-red-500'>{errors.fullname}</span>}
                </div>
                </div>
               
               <div className='mb-4'>
                 <div className='relative'>
                    <Input
                    value={input.email}
                    onChange={changeEventHandler}
                    name="email"
                        type="email"
                        placeholder="Email" className='pl-10 focus-visible:ring-1'
                    />
                    <Mail className='absolute inset-y-2 left-2 text-gray-500 pointer-events-none ' />
                    {errors && <span className='text-red-500'>{errors.email}</span>}
                </div>
               </div>
               <div className='mb-4'>
                <div className='relative'>
                    
                    <Input
                           value={input.password}
                    onChange={changeEventHandler}
                    name="password"
                        type="password"
                        placeholder="Password" className='pl-10 focus-visible:ring-1'
                    />
                    <LockKeyhole className='absolute inset-y-2 left-2 text-gray-500 pointer-events-none ' />
                    {errors && <span className='text-red-500'>{errors.password}</span>}
                </div>

               </div>
               <div className='mb-4'>
                 <div className='relative'>
                    <Input
                    type="text"
                    value={input.contact}
                    onChange={changeEventHandler}
                    name="contact"
                       
                        placeholder="Phone Number   " className='pl-10 focus-visible:ring-1'
                    />
                    <PhoneOutgoing className='absolute inset-y-2 left-2 text-gray-500 pointer-events-none ' />
                    {errors && <span className='text-red-500'>{errors.contact}</span>}
                </div>
                </div>
              < div className='mb-4'>
              {
                loading ? <button disabled className='bg-orange-500 w-full py-3 flex items-center justify-center gap-2'><Loader2 size={40} className="  !w-10 !h-5 mr-2  animate-spin"/>please wait..</button>
                  :<button type="submit" className='w-full !bg-orange-500 p-2 rounded-b-lg '>Signin</button>
              }
                
               </div>
                <Separator className="my-4 h-[1px] items-center justify-center flex bg-gray-300" />
              <p className="items-center justify-center text-lg flex  text-center text-gray-500 mt-4 whitespace-nowrap">
                 Already have an account?{" "}
                <Link to={'/Login'} className="text-blue-500 font-medium">Login</Link>
              
                 </p>
            </form>
        </div>
    )
}
export default Signup