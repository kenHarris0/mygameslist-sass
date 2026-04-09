import Message from '../models/Message.js'

import cloudinary from '../config/Cloudinary.js';
import {io,returnUsersocket} from '../config/socket.js'



export const sendMessage=async(req,res)=>{
    try{
        
        const {userId}=req;
        const {receiverId,text,image}=req.body;
        if (!receiverId) {
    return res.status(400).json({ success: false, message: "Receiver required" });
}

if (!text && !image) {
    return res.status(400).json({ success: false, message: "Message cannot be empty" });
}

        let img=null;
        if(image){
            const result=await cloudinary.uploader.upload(image);
            if(result.secure_url){
                img=result.secure_url;
            }
        }


        const message=new Message({
            senderId:userId,
            receiverId,
            text,
            image:img
        })
        await message.save()

        const receiverSocket=returnUsersocket(receiverId)
        if(receiverSocket){
            io.to(receiverSocket).emit('newmessage',message)
        }

        res.json({success:true,payload:message})



    }
    catch(err){
        console.log(err)
    }
}

export const getMessages=async(req,res)=>{
      try{
        const {userId}=req;
        const {receiverId}=req.body;

        const messages=await Message.find({
            $or:[
                {senderId:userId,receiverId},
                {senderId:receiverId,receiverId:userId}
            ]
        }).sort({createdAt:1})

      

        res.json({success:true,payload:messages})



    }
    catch(err){
        console.log(err)
    }
}


export const getallmessagedusers=async(req,res)=>{
    try{
        const {userId}=req;

        const messages=await Message.find({
            $or:[
                {senderId:userId},
                {receiverId:userId}
            ]
        })

        const users = new Set(messages.map(msg=>msg.senderId.toString()===userId.toString()?msg.receiverId.toString():msg.senderId.toString()))

       

        res.json({success:true,payload:Array.from(users)})

    }
    catch(err){
        console.log(err)
    }
}