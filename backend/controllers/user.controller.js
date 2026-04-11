import User from '../models/User.js';
import bcrypt from 'bcrypt'
import { assignCookie } from '../config/cookies.js';
import Game from '../models/Game.js'
import cloudinary from '../config/Cloudinary.js';
import {io} from '../config/socket.js'
import {returnUsersocket} from '../config/socket.js'
import Party from '../models/Party.js';


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
            return res.json({success:false,payload:newuser})
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
const finaluser = await User.findOne({ email }).select("-password");

    res.json({success:true,payload:finaluser})
}
catch(err){
    console.log(err)
}


}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 0  
        })
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch(err) {
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
        const user=await User.findById(userId).select("-password").populate("friends").select("-password").
        populate("games.game").populate("friendRequestsSent","name image").populate("friendRequestsReceived","name image").
        populate("PartyRequestsSent.receiverId","name image").populate("PartyRequestsReceived.senderId","name image").
        populate("PartyRequestsSent.partyId","name").populate("PartyRequestsReceived.partyId","name")
        if(!user){
            return res.json({success:false,message:"user not found"})
        }

        res.json({success:true,payload:user})

    }
    catch(err){
    console.log(err)
}
}

//add frineds

export const sendFriendReq=async(req,res)=>{
    try{
        const {userId}=req;
        const {friendId}=req.body;
        if (userId.toString() === friendId.toString()) {
    return res.json({ success: false, message: "You cannot send request to yourself" });
}

        const user=await User.findById(userId);
        if(!user){
            return res.json({success:false,message:"user not found to add friend"})
        }
        const friend=await User.findById(friendId);
 if(!friend){
            return res.json({success:false,message:"friend bot found to add"})
        }

    const alreadyAdded=user.friends.find((friend)=>friend.toString()===friendId.toString())
    if(alreadyAdded){
        return res.json({success:false,message:"frined already exists"})
    }
    const alreadyinSent=user.friendRequestsSent.find((friend)=>friend.toString()===friendId.toString())
    if(alreadyinSent){
        return res.json({success:false,message:"friend req already sent"})
    }
    

    await User.updateOne({
        _id:userId
    },{
        $addToSet:{
            friendRequestsSent:friendId
        }
    })
    await User.updateOne({
        _id:friendId
    },{
        $addToSet:{
            friendRequestsReceived:userId
        }
    })

    

const friendSocketId=returnUsersocket(friendId)
 if (friendSocketId) {
      io.to(friendSocketId).emit("friendreqreceived", {
        _id: user._id,
        name: user.name,
        image: user.image,
      });
    }

    const userSocketId=returnUsersocket(userId)
 if (userSocketId) {
      io.to(userSocketId).emit("friendreqsent", {
        _id: friend._id,
        name: friend.name,
        image: friend.image,
      });
    }

res.json({success:true,message:"friend added successfully"})



    }
    catch(err){
        console.log(err)
    }
}






export const acceptFriendReq=async(req,res)=>{
    try{
        const {userId}=req;
        const {friendId}=req.body;

        const user=await User.findById(userId);
        if(!user){
            return res.json({success:false,message:"user not found to add friend"})
        }
        const friend=await User.findById(friendId);
 if(!friend){
            return res.json({success:false,message:"friend bot found to add"})
        }

    const alreadyAdded=user.friends.find((friend)=>friend.toString()===friendId.toString())
    if(alreadyAdded){
        return res.json({success:false,message:"frined already exists"})
    }
    const reqExist=user.friendRequestsReceived.find(reqq=>reqq.toString()===friendId.toString())
    if(!reqExist){
        return res.json({success:false,message:"no req found"})
    }


    await User.updateOne({
        _id:userId,
    },
{
    $addToSet:{
        friends:friendId
    },
    $pull:{
        friendRequestsReceived:friendId
    }
})
await User.updateOne({ 
    _id:friendId,
},{
$addToSet:{
    friends:userId

},
$pull:{
    friendRequestsSent:userId
}})

const senderSocketId=returnUsersocket(friendId)
if(senderSocketId){
    io.to(senderSocketId).emit("friendreqaccepted-sender",{
        _id:user._id,
        name:user.name,
        image:user.image
    })
}

const receiverSocketId=returnUsersocket(userId)
if(receiverSocketId){
    io.to(receiverSocketId).emit("friendreqaccepted-receiver",{
        _id:friend._id,
        name:friend.name,
        image:friend.image
    })
}
res.json({success:true,message:"friend added successfully"})
}
    catch(err){
        console.log(err)
    }
}

//reject friend req

export const rejectFriendReq=async(req,res)=>{
     try{
        const {userId}=req;
        const {friendId}=req.body;

        const user=await User.findById(userId);
        if(!user){
            return res.json({success:false,message:"user not found to add friend"})
        }
        const friend=await User.findById(friendId);
 if(!friend){
            return res.json({success:false,message:"friend bot found to add"})
        }

           const reqExist=user.friendRequestsReceived.find(reqq=>reqq.toString()===friendId.toString())
    if(!reqExist){
        return res.json({success:false,message:"no req found"})
    }

            await User.updateOne({
        _id:userId,
    },
{
    $pull:{
        friendRequestsReceived:friendId
    }
})
await User.updateOne({ 
    _id:friendId,
},{
$pull:{
    friendRequestsSent:userId
}})


const senderSocketId=returnUsersocket(friendId)
if(senderSocketId){
    io.to(senderSocketId).emit("friendreqrejected-sender",{
        _id:user._id,
        name:user.name,
        image:user.image
    })
}


res.json({success:true,message:"friend req rejected "})
}
    catch(err){
        console.log(err)
    }
}

//getalluser games

export const getUserGames=async(req,res)=>{
    try{
        const {userId}=req;

        const user=await User.findById(userId).select("games").populate("games.game")
         if (!user) {
            return res.json({ success: false, message: "user not found" });
        }

        res.json({
            success: true,
            payload: user.games
        });

    }
    catch(err){
        console.log(err)
    }
}

// change userprofile picture
export const changeProfilePicture=async(req,res)=>{
    try{
    const {userId}=req
    const {image}=req.body;

    const user=await User.findById(userId);
    if(!user){
        return res.json({success:false,message:"user not found"})
    }
    let img=null
    if(image){
        const ress=await cloudinary.uploader.upload(image)
        if(ress.secure_url){
            img=ress.secure_url
        }
    }

    await User.updateOne({
        _id:userId
    },
{
    $set:{
        image:img
    }
})

res.json({success:true,payload:img})

    }
    catch(err){
        console.log(err)
    }
}

//edit profile
export const editProfile=async(req,res)=>{
     try{
    const {userId}=req
    const {name,bio,status}=req.body;

    const user=await User.findById(userId);
    if(!user){
        return res.json({success:false,message:"user not found"})
    }
   

    await User.updateOne({
        _id:userId
    },
{
    $set:{
        name:name,
        bio:bio,
        status:status
    }
})

res.json({success:true,message:"profile updated successfully"})

    }
    catch(err){
        console.log(err)
    }
}

// change status of user like playing valo ,rust when game status is changed

export const editcurrentlyplaying=async(req,res)=>{
    try{
        const {userId}=req;
        const {gameName}=req.body;

        await User.updateOne({
            _id:userId

        },
    {
        $set:{
            currentlyPlaying:gameName
        }
    })

    res.json({success:true,payload:gameName})

    }
    catch(err){
        console.log(err)
    }
}

//get all users frined

//get all users
export const getallusers=async(req,res)=>{
    try{
        const {userId}=req;

        const users=await User.find().select("-password").populate("friends").select("-password").populate("games.game")
        const filteredUsers=users.filter(user=>user._id.toString()!==userId.toString())

        res.json({success:true,payload:filteredUsers})

    }
    catch(err){
        console.log(err)
    }
}

export const sendPartyReq = async (req, res) => {
    try {
        const { userId } = req;
        const { partyId } = req.body;

        if (!partyId) {
            return res.json({ success: false, message: "party id is required" });
        }

        const user = await User.findById(userId);
        const party = await Party.findById(partyId).populate("admin");

        if (!party) {
            return res.json({ success: false, message: "Party not found" });
        }

        const admin = party.admin._id;

        
        if (admin.toString() === userId.toString()) {
            return res.json({ success: false, message: "You are the admin" });
        }

        
        const alreadySent = user.PartyRequestsSent.some(
            req =>
                req.partyId.toString() === partyId &&
                req.receiverId.toString() === admin.toString()
        );

        if (alreadySent) {
            return res.json({ success: false, message: "Request already sent" });
        }

        
        await User.updateOne(
            { _id: userId },
            {
                $push: {
                    PartyRequestsSent: {
                        partyId: partyId,
                        receiverId: admin
                    }
                }
            }
        );

      
        await User.updateOne(
            { _id: admin },
            {
                $push: {
                    PartyRequestsReceived: {
                        partyId: partyId,
                        senderId: userId
                    }
                }
            }
        );

        // 🔌 socket
        const adminSocketId = returnUsersocket(admin);
        if (adminSocketId) {
            io.to(adminSocketId).emit("party-req-received", {
                _id: userId,
                name: user.name,
                image: user.image,
                partyId ,
                partyname:party.name
            });
        }

        res.json({ success: true, message: "party join req sent successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const acceptPartyReq = async (req, res) => {
    try {
        const { userId } = req; // admin
        const { senderId, partyId } = req.body;

        if (!senderId || !partyId) {
            return res.json({ success: false, message: "senderId and partyId required" });
        }

        const user = await User.findById(userId);
        const party = await Party.findById(partyId);
        const sender = await User.findById(senderId);

        
        if (!party) {
            return res.json({ success: false, message: "Party not found" });
        }

       
        //already in reqreceived
        const reqexist=user.PartyRequestsReceived.some(req=>req.partyId.toString()===partyId.toString() && req.senderId.toString()===senderId.toString())
        if(!reqexist){
            return res.json({success:false,message:"no such requests"})
        }

        
        if (party.members.length >= party.limit) {
            return res.json({ success: false, message: "Party is full" });
        }

        await User.updateOne(
            { _id: userId },
            { $pull: { PartyRequestsReceived:{
                partyId:partyId,
                senderId:senderId
            } } }
        );

        await User.updateOne(
            { _id: senderId },
            { $pull: { PartyRequestsSent: {
                partyId,
                receiverId:userId
            } } }
        );

    
        await Party.updateOne(
            { _id: partyId },
            { $addToSet: { members: senderId } }
        );

        const senderSocketId = returnUsersocket(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("party-req-accepted", {
                _id: sender._id,
                name: sender.name,
                image: sender.image,
                adminId:userId,
                partyId,
                partyname:party.name,
                party:await Party.findById(partyId).populate("members").select("-password -email")
            });
        }

        res.json({ success: true, message: "party join req accepted successfully",payload:{
            partyId,
            userId:senderId,
            party:await Party.findById(partyId).populate("members").select("-password -email")
        } });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const rejectPartyReq = async (req, res) => {
    try {
        const { userId } = req;//admin
        const { senderId,partyId } = req.body;

        if (!senderId) {
            return res.json({ success: false, message: "sender request id is required" });
        }

        const user = await User.findById(userId);
         const party = await Party.findById(partyId);
    const sender = await User.findById(senderId);
        
        if (!party) {
            return res.json({ success: false, message: "Party not found" });
        }


        
        const reqexist=user.PartyRequestsReceived.some(req=>req.partyId.toString()===partyId.toString() && req.senderId.toString()===senderId.toString())
        if(!reqexist){
            return res.json({success:false,message:"no such requests"})
        }

        await User.updateOne(
            { _id: userId },
            { $pull: { PartyRequestsReceived:{
                partyId:partyId,
                senderId:senderId
            } } }
        );

        await User.updateOne(
            { _id: senderId },
            { $pull: { PartyRequestsSent: {
                partyId,
                receiverId:userId
            } } }
        );

        const senderSocketId = returnUsersocket(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("party-req-rejected", {
                _id: sender._id,
                name: sender.name,
                image: sender.image,
                partyId,
                partyname:party.name

            });
        }

        res.json({ success: true, message: "party join req rejected",payload:{
            partyId,
            userId:senderId,
           
        } });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};