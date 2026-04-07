import Party from '../models/Party.js'
import User from '../models/User.js'
import {io,returnUsersocket} from '../config/socket.js'



export const createParty=async(req,res)=>{
    try{
        const {name,members,game,Open,limit}=req.body;
        const {userId}=req

        if(!name || !members || members.length<1 || !game){
            return res.json({success:false,message:"Please provide all details"})
        }

        const newparty=new Party({
            name,
            members,
            game,
            Open,
            limit,
            admin:userId
        })
        await newparty.save();

        io.emit('newpartycreated',newparty)

        res.json({success:true,message:"party created successfully",party:newparty})

    }
    catch(err){
        console.log(err)
    }
}
export const joinParty=async(req,res)=>{
    try{
        const {partyId}=req.body
        const {userId}=req
        const user=await User.findById(userId).select("-password -email")

        const party=await Party.findById(partyId)
        if(!party){
            return res.json({success:false,message:"no party exists"})
        }

        if(party.members.length>=party.limit){
             return res.json({success:false,message:"party is full"})
        }
         
         if (party.members.some(m => m.toString() === userId)) {
  return res.json({ success: false, message: "Already in party" })
}

        const updatedparty=await Party.findByIdAndUpdate(partyId,{
            $addToSet:{
                members:userId
            }
        },{new:true}).populate("members","-password -email")



        updatedparty.members.forEach(member=>{
            if(member._id.toString()!==userId.toString()){
            const socketId=returnUsersocket(member._id.toString())
            if(socketId){
                io.to(socketId).emit('newpartyjoin',{user,party:updatedparty})
            }
        }
        })
        io.emit('partyUpdated', updatedparty)

        res.json({success:true,message:"joined party successfully",payload:updatedparty})

    }
    catch(err){
        console.log(err)
    }
}
export const deleteParty=async(req,res)=>{
    try{
        const {partyId}=req.body;

       const party=await Party.findById(partyId)
       if(!party){
        return res.json({success:false,message:"no party exists"})
       }
       await Party.findByIdAndDelete(partyId);

        party.members.forEach(memberId=>{
    const socketId=returnUsersocket(memberId.toString())
    if(socketId){
        io.to(socketId).emit('partydeletednotification',party)
    }
 })

 io.emit('partyDeleted',partyId)

        res.json({success:true,message:"party deleted successfully"})

    }
    catch(err){
        console.log(err)
    }
}

export const leaveParty=async(req,res)=>{
    try{
        const {partyId}=req.body;
const {userId}=req
  const user=await User.findById(userId).select("-password -email")
 const party=await Party.findByIdAndUpdate(partyId,{
    $pull:{
        members:userId
    }
 },{new:true}).populate("members","-password -email")

 party.members.forEach(member=>{
if(member._id.toString()!==userId.toString()){
    const socketId=returnUsersocket(member._id.toString())
    if(socketId){
        io.to(socketId).emit('leftpartyupdate',{
            user,
           party:party
        })
    }
}
 })
 io.emit('partyUpdated', party)

        res.json({success:true,message:"left party successfully",payload:party})

    }
    catch(err){
        console.log(err)
    }
}

export const getallparty=async(req,res)=>{
    try{
        

        const parties=await Party.find().populate("members").select("-password -email")
       

        res.json({success:true,payload:parties})

    }
    catch(err){
        console.log(err)
    }
}




