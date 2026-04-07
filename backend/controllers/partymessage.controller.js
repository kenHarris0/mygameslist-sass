import Party from '../models/Party.js'
import Partymessage from '../models/PartyMessage.js'
import {io,returnUsersocket} from '../config/socket.js'
import Cloudinary from '../config/Cloudinary.js'




export const sendMessage=async(req,res)=>{
    try{
       const {groupId,text,image}=req.body
       const senderId=req.userId
       if(!groupId){
        return res.json({success:false,message:"need a group id"})
       }
     let img=null
     if(image){
        const result=await Cloudinary.uploader.upload(image)
        if(result.secure_url){
            img=result.secure_url
        }
     }

    const newMessage=new Partymessage({
        senderId,
        groupId,
        text,
        image:img
    })
    await newMessage.save()
    const populatedmessage = await newMessage.populate({
  path: "senderId",
  select: "-password"
});

    io.to(groupId.toString()).emit("new-party-message",populatedmessage)

   



    res.json({success:true,message:"party message sent",payload:populatedmessage})



    }
    catch(err){
        console.log(err)
    }
}

export const getallMessages=async(req,res)=>{
    try{
       const {groupId}=req.body
       
       if(!groupId){
        return res.json({success:false,message:"need a group id"})
       }

       const groupMessages=await Partymessage.find({groupId}).populate("senderId").select("-password").sort({createdAt:1})


     



    res.json({success:true,message:"party messages fetched",payload:groupMessages})



    }
    catch(err){
        console.log(err)
    }
}