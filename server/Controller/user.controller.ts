import type { Request, Response } from "express";
import { User } from "../models/user.model.ts";
import bcrypt from "bcryptjs";
import crypto from "crypto"
import cloudnary from "../utils/cloudinary.ts";
import { generateVerificationCode } from "../utils/generateVerificationCode.ts";
import { generateToken } from "../utils/generateToken.ts";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email.ts";

export const signup = async (req: Request, res: Response) => {
    try {
        const { fullname, email, password, contact } = req.body
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exist with this email"

            })
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = generateVerificationCode()
        user = await User.create({
            fullname,
            email,
            password: hashedPassword,
            contact: Number(contact),
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        })
        // 65b0f487272be32e975efa9177df3899
        generateToken(res,user)

        await sendVerificationEmail(email,verificationToken);

        const userWithoutPassword = await User.findOne({ email }).select("-password");
        return res.status(201).json({
            success: true,
            message: "Account created Successfully",
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ Message: "internal server error" })
    }
}


declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

export {};
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "incorrect email or password"
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "incorrect password"
            })
        }
        generateToken(res,user)
        user.lastlogin = new Date()
        await user.save()

        // send user without password
        const userWithoutPassword = await User.findOne({ email }).select("-password");
        return res.status(200).json({
            success: true,
            message: `welcome back ${user.fullname}`,
            user: userWithoutPassword
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "internal server error "
        })

    }

}

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { verificationCode } = req.body
        // console.log(verificationCode)
        const user = await User.findOne({ verificationToken: verificationCode, verificationTokenExpiresAt: { $gt: Date.now() } }).select("-password")
        if (!user) {
            return res.status(400).json({
                success: true,
                message: "invalid or expired verification token"
            })
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        //send welcome email
        await sendWelcomeEmail(user.email,user.fullname);
        return res.status(200).json({
            success: true,
            message: "email verified success",
            user,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "internal server error "
        })
    }

}
export const logout = (_: Request, res: Response) => {
    try {
        return res.clearCookie("token").status(200).json({
            success: true,
            message: "loggout successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "internal server error "
        })
    }

}
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user doesn't exits"
            })
        };
        const resetToken = crypto.randomBytes(40).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1hour
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        await user.save();

        // send email
        await sendPasswordResetEmail(user.email,
            `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`)
        return res.status(200).json({
            success: true,
            message: "password reset link send to your email"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "internal server error "
        })
    }
};
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const user = await User.findOne({ resetPasswordToken: token,
             resetPasswordTokenExpiresAt: {$gt:Date.now()}})
        if(!user){
             return res.status(400).json({
                success: false,
                message: "invaled or expired resettoken"
            })
        }
        const hashedPassword = await bcrypt.hash(newPassword,10)
        user.password = hashedPassword
        user.resetPasswordToken=undefined
        user.resetPasswordTokenExpiresAt=undefined
        await user.save();
        // send success reset email
        await sendResetSuccessEmail(user.email);
        return res.status(200).json({
            success:true,
            message:"Password reset successfully"
        })


} catch (error) {
    console.log(error)
    return res.status(500).json({
        message: "internal server error "
    });
}

}

export const checkAuth = async (req:Request,res:Response)=>{
   try {
     const userId = req.id
     const user = await User.findById(userId).select("-password")
     if(!user){
         return res.status(404).json({
             success:false,
             message:"user not found"
         })
     }
     return res.status(200).json({
        success:true,
        user
     })
   } catch (error) {
    console.log(error)
    return res.status(500).json({
        message: "internal server error "
    });
   }


}
export const updateProfile = async (req:Request,res:Response)=>{
try {
    const userId = req.id;
    const {fullname, email, address,city,country, profilePicture} = req.body
    // upload inage on cloudnary
    let cloudResponse:any
    const updatedDate: any = { fullname, email, address, city, country }
    if (profilePicture) {
        try {
            // if profilePicture is already a url, skip upload
            if (typeof profilePicture === 'string' && profilePicture.startsWith('http')) {
                updatedDate.profilePicture = profilePicture
            } else {
                cloudResponse = await cloudnary.uploader.upload(profilePicture)
                updatedDate.profilePicture = cloudResponse.secure_url
            }
        } catch (uploadErr) {
            console.error('Cloudinary upload failed:', uploadErr)
            return res.status(500).json({ success: false, message: 'Failed to upload profile picture' })
        }
    }
    const user = await User.findByIdAndUpdate(userId,updatedDate,{new:true}).select("-password");
    return res.status(200).json({
        success:true,
        message:'Profile updated succesfully',
        user
    }); 
} catch (error) {
    console.error('updateProfile error:', error)
    return res.status(500).json({
        message: "internal server error "
    });
}
}