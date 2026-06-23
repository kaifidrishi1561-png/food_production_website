import type { Request,Response } from "express";
import {type NextFunction}  from "express";
import jwt from  "jsonwebtoken"
declare global{
    namespace Express{
        interface Request{
            id:string
        }
    }
}
export const isAuthenticated = async (req:Request,res:Response, next:NextFunction)=>{
    try {
        const token = req.cookies.token;

     

        // debug: log cookies when missing token
        if(!token){
            console.debug('isAuthenticated: no token cookie present, cookies=', req.cookies)
        }
        if(!token){
            return res.status(401).json({
                success:false,
                message:"User not authentication"
            })
        }
        // verify the token
        const decode = jwt.verify(token,process.env.SECRET_KEY!) as jwt.JwtPayload;
        // check in decoded was successfully
        if(!decode){
            return res.status(401).json({
                success:true,
                message:"invalid token"
            })
        }
        req.id = decode.userId;
        next()
    } catch (error) {
        return res.status(500).json({
            message:"internal server error"
        })
        
    }
}
