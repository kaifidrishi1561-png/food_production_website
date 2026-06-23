import type { IUserDocument } from "../models/user.model.ts";
import jwt from 'jsonwebtoken'
import type { Response } from "express";

export const generateToken = (res:Response,user:IUserDocument )=>{
    const token = jwt.sign({userId:user._id},process.env.SECRET_KEY!,{expiresIn:'1d'});
// For cross-origin requests from the frontend dev server, set SameSite to 'none' and
// make cookie secure in production. Chrome requires `secure: true` when `sameSite: 'none'`.
const isProd = process.env.NODE_ENV === 'production'
res.cookie("token", token, {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
})
return token;


}