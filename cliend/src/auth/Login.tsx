// tsrafce  
import {  useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { userLoginSchema, type LoginInputState } from "@/schema/userSchema";
import { Separator } from "@base-ui/react";
import { Loader2, LockKeyhole, Mail, Route } from "lucide-react"
import ResetPassword from './ResetPassword'
import { Link } from "react-router-dom";
import Signin from "./Signup";
import { useState } from "react";
import type { FormEvent } from "react"
import ForgotPassword from "./ForgotPassword";
import { useUserStore } from "@/store/useUserStore";
// interface LoginInputState {
// email: string;
// password: string;
// }


const Login = () => {
    // const loading = false;
    const [input, setInput] = useState<LoginInputState>({
        email: "",
        password: "",
    })
    const [errors, setErrors] = useState<Partial<LoginInputState>>({})
    const {loading,login} = useUserStore();
    const navigate = useNavigate()
    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name,value} = e.target;
        setInput({...input,[name]:value})
    }
    const loginSubmitHandler = async(e:FormEvent)=>{
        e.preventDefault();
        const result = userLoginSchema.safeParse(input);
        if(!result.success){
            const  fieldErrors  = result.error.flatten().fieldErrors;
            setErrors(fieldErrors as Partial<LoginInputState>);
            return;
        }
        // console.log(input)
        await login(input)
        try {
            await login(input)
            navigate("/")
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
                    value={input.email}
                    onChange={changeEventHandler}
                    name="email"
                        type="email"
                        placeholder="Email" className='pl-10 focus-visible:ring-1'
                    />
                    <Mail className='absolute inset-y-2 left-2 text-gray-500 pointer-events-none ' />
                    {errors.email && <span className='text-red-500'>{errors.email}</span>}
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
                    {errors.password && <span className='text-red-500'>{errors.password}</span>}
                </div>

               </div>
              < div className='mb-4'>
              {
                loading ? <button disabled className='bg-orange-500 w-full py-3 flex items-center justify-center gap-2'><Loader2 size={40} className="  !w-10 !h-5 mr-2  animate-spin"/>please wait..</button>
                  :<button type="submit" className='w-full !bg-orange-500 p-2 rounded-b-lg '>Login</button>
              }
               <div className="flex justify-between">

                <Link to="/ForgotPassword" className="text-sm text-blue-500 mt-2 block font-bold text-right hover:underline">forgot password?</Link>
                    <Link to="/ResetPassword" className="text-blue-500 font-medium font-bold">ResetPassword</Link>
               </div>
               
               </div>
                <Separator className="my-4 h-[1px] items-center justify-center flex bg-gray-300" />
              <p className="items-center justify-center text-lg flex  text-center text-gray-500 mt-4 whitespace-nowrap">
                don't have an  account?{" "}  
                    <Link to="/Signup" className="!text-blue-500 font-medium">signup</Link>
                  </p>
              {/* <NavLink to="/Signup">signup</NavLink> */}
            </form>
        </div>
    )
}
export default Login