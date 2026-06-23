import { useUserStore } from "@/store/useUserStore"
import { Input } from "@base-ui/react"
import { Button } from "@base-ui/react"
import { LetterText, Loader2 } from "lucide-react"
import React, { useRef, useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"


const VerifyEmail = () => {
    const [otp , setOtp] =useState<string[]>(["","","","","",""])
    const inputref = useRef<any>([])
    const navigate = useNavigate()

    const {loading,VerifyEmail} = useUserStore()

    const handleChange = (index:number,value:string)=>{
        if(/^[a-zA-z0-9]$/.test(value) || value === ""){
            const newOtp = [...otp]
            newOtp[index] = value
            setOtp(newOtp)

        }
        // move to the next input feild id a digit is entered
        if(value !== "" && index < 5){
            inputref.current[index+1].focus()
        }       
    }
    const handleKeyDown = (index:number,e:React.KeyboardEvent<HTMLInputElement>)=>{
        if(e.key === 'Backspace' && !otp[index] && index >0){
            inputref.current[index-1].focus()
        }
    }
    const submitHandler= async (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        const verificationCode =otp.join("")
        try {
                await VerifyEmail(verificationCode)
                const {user} = useUserStore.getState()
                if(user?.isVerified){

                    navigate('/');
                }
            } catch (error) {
                console.log(error)
            }
    }

  return (
    <div className="flex items-center justify-center h-screen w-full">

    <div className="p-8 rounded-md w-full max-w-md flex flex-col gap-10 border border-gray-300">
        <div className=" text-center">
            <h1 className="font-extrabold text-2xl">verify your email</h1>
            <p className="text-sm text-gray-600">enter the 6 digit code send to your email address </p>
        </div>
    <form onSubmit={submitHandler}>
        <div className="flex justify-between">
            {
                    otp.map((Letter:string,idx:number)=>(
                        <Input
                        key={idx}
                        ref = {(element) => {
                            inputref.current[idx] = element
                        }}
                        onKeyDown={(e:React.KeyboardEvent<HTMLInputElement>)=> handleKeyDown(idx,e)}
                        type="text"
                        maxLength={1}
                        onChange={(e:React.ChangeEvent<HTMLInputElement>)=>handleChange(idx,e.target.value)}
                        value={Letter}
                        className='md:w-12 md:h-12 w-8 h-8 text-center text-sm md:text-2xl font-normal md:font-bold rounded-lg focus:outline-none focus ring-2 focus:ring-indigo-500'
                        />
                    ))
            }
        </div>
        {loading?<Button disabled className="bg-amber-400 justify-center flex p-3  hover:bg-red-400  mt-6 w-full h-12 rounded-2xl">
             <Loader2 className="mr-2 w-4 h-4 animate-spin  "/>please waiting
        </Button>:<Button type="submit" className="bg-amber-400 hover:bg-red-400 mt-6 w-full h-9 rounded-2xl">verify</Button>
               }
    </form>
    </div>
    </div>
  )
}

export default VerifyEmail