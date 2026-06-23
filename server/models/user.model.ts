import mongoose, { Types,Document } from "mongoose";

export interface IUser{
    //  _id: mongoose.Schema.Types.ObjectId;
    fullname:string;
    email:string;
    password:string;
    contact:number;
    address:string;
    city:string;
    country:string;
    profilePicture:string;
    admin:boolean;
    lastlogin?:Date;
    isVerified?:boolean;
    resetPasswordToken?:string;
    resetPasswordTokenExpiresAt?:Date;
    verificationToken?:string;
    verificationTokenExpiresAt?:Date;
    // createdAt:Date;
    // updatedAt:Date;

}
export interface IUserDocument extends IUser,Document {
    _id:Types.ObjectId      
    createdAt:Date;
    updatedAt:Date;
}
const userSchema  = new mongoose.Schema<IUserDocument>({
    fullname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    contact:{
        type:Number,
        require:true
    },
    address:{
        type:String,
        default:"update your address"
    },
    city:{
        type:String,
        default:"update your address"
    },
    country:{
        type:String,
       default:"update your address"
    },
    profilePicture:{
        type:String,
        default:""
    },
    admin:{type:Boolean,default:false},
    // advance authantication
    lastlogin:{
        type:Date,
        default:Date.now
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    resetPasswordToken:String,
    resetPasswordTokenExpiresAt :Date,
    verificationToken:String,
    verificationTokenExpiresAt:Date,

    
    
},{timestamps:true})
export const User = mongoose.model('User',userSchema)