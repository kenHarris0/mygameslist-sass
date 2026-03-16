import jwt from 'jsonwebtoken'
import User from '../models/User.js';



export const authmiddleware=async(req,res,next)=>{
    try{
        const token=req?.cookies?.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized"})
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        if(decoded){
            const userId=decoded.userId;
            const user=await User.findById(userId).select('-password')

            req.userId=userId;
            req.user=user;
            next();

        }

    }
    catch(err){
        console.log(err)
    }
}