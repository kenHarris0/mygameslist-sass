import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'


export const assignCookie=async(res,userId)=>{
    try{
    const token=jwt.sign({userId:userId},process.env.JWT_SECRET,{expiresIn:'1d'});

    res.cookie("jwt",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"lax",
        maxAge:24*60*60*1000
    })
    return token;
}
catch(err){
    console.log(err)
}

}