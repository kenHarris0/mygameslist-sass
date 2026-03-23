import jwt from 'jsonwebtoken'
import User from '../models/User.js'


export const socketMiddleware=async(socket,next)=>{
    try{
        const token=socket?.handshake?.headers?.cookie?.split(';').find(row=>row.trim().startsWith('jwt=')).split('=')[1]
        if(!token){
            return next(new Error('Authentication error'))
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        if(decoded){
            const userId=decoded.userId;
            const user=await User.findById(userId).select('-password')

            socket.userId=userId;
            socket.user=user;
            next();
        }



    }
    catch(err){
        next(new Error('Authentication error'))
        console.log(err)
    }
}