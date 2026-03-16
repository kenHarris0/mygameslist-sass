import User from '../models/User.js';
import bcrypt from 'bcrypt'
import { assignCookie } from '../config/cookies.js';

export const register=async(req,res)=>{
    const {name,email,password}=req.body
    try{

    if(!name || !email || !password){
        return res.json("missing credentials or details")
    }

    const user=await User.findOne({email:email})
    if(user){
        return res.json("user already exists ,please login")
    }

    const hashed=await bcrypt.hash(password,10);

    const newuser= new User({
        name,email,
        password:hashed
    })
    await newuser.save()
    //sending cookies to the frontend
    try{
        const token=await assignCookie(res,newuser._id)
        if(!token){
            return res.json({success:false,message:"error in assigning cookies"})
        }

    }
    catch(err){
    console.log(err)
}
    

    res.json({success:true,message:"user registerd successfully"})
}
catch(err){
    console.log(err)
}


}

export const login=async(req,res)=>{
    const {email,password}=req.body
    try{

    if(!email || !password){
        return res.json("missing credentials or details")
    }

    const user=await User.findOne({email:email})
    if(!user){
        return res.json("user doesn't  exists ,please register")
    }

    const checkpassword=await bcrypt.compare(password,user.password);
    if(!checkpassword){
        return res.json("invalid password,enter correct password")
    }
//assigning cookies to the frontend
  try{
        const token=await assignCookie(res,user._id)
        if(!token){
            return res.json({success:false,message:"error in assigning cookies"})
        }

    }
    catch(err){
    console.log(err)
}

    res.json({success:true,message:"user logged in successfully"})
}
catch(err){
    console.log(err)
}


}

export const logout=async(req,res)=>{
    try{
        res.cookie("jwt","",{
            maxAge:0,
        })
        res.status(200).json({ message: "Logged out successfully" });

    }
    catch(err){
    console.log(err)
}
}

export const checkAuth=async(req,res)=>{
    try{
return res.json({success:true,message:"user is authenticated"})
    }
   catch(err){
    console.log(err)
}
}

export const getuserdata=async(req,res)=>{
    try{
        const userId=req.userId
        const user=await User.findById(userId).select("-password")

        if(!user){
            return res.json({success:false,message:"user not found"})
        }

        res.json({success:true,payload:user})

    }
    catch(err){
    console.log(err)
}
}
