import { Input } from '@/components/ui/input';
import React from 'react'
import { Loader2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import  Login from "./Login"
// import usestate
import { useState } from 'react';
import { Button } from '@base-ui/react';
const ForgotPassword = () => {
  const [email,setEmail] = useState<string>("");
  const loading = false;  
  return (
   < div className='flex items-center justify-center min-h-screen w-full'   >
        <form className='flex flex-col gap-5 md:p-8 w-full max-w-md rounded-lg mx-4' action="">
            <div className=' text-center    '>
                    <h1 className='text-2xl font-bold text-black mb-2'>Forgot Password</h1>
                    <p className='text-gray-500'>Enter your email to reset your password</p>
                </div>
                <div className='relative w-full'>
                    <Input type="text"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className='pl-10'
                     />
                     <Mail className="absolute inset-2 left-2 text-gray-500 pointer-events-none" />
                  </div>
                  {loading ?( <Button disabled className='flex items-center justify-center font-bold bg-orange-400 rounded-2xl  p-2'><Loader2 className='m-2 h-4 w-4 animate-spin' />please wait</Button>)
                  :(<Button className="bg-amber-500 rounded-b-md p-2 ">send message </Button>)}
                  <span className='items-center justify-center flex'>back to {" "}
                      <Link className='text-blue-600 ' to="/Login">login</Link></span>
        </form>
   </div>
  )
}

export default ForgotPassword