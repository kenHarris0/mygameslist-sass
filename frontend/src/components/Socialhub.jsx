import React, { useContext, useState,useEffect } from 'react'
import {Users,Gamepad2} from 'lucide-react'
import {useNavigate} from 'react-router-dom'
import {gamecontext} from '../Context/Context'
import {useSelector,useDispatch} from 'react-redux'
import axios from 'axios'
import {getallparties} from '../Redux/Slices/PartySlice'



const Socialhub = () => {

  const {userdata,socket,onlineusers,getuserdata,allusers}=useContext(gamecontext)
  const [currenttype,setcurrenttype]=useState("friends")
const {url}=useContext(gamecontext)
const dispatch=useDispatch()


  const parties=useSelector(state=>state.party.parties)
  let userParties = [];

if (parties && userdata?._id) {
  userParties = parties.filter(party =>
    party.members?.some(mem =>
      mem?._id?.toString() === userdata._id?.toString()
    )
  );
}
console.log(userParties)


const friendIds = new Set(
  userdata?.friends?.map(f => f._id.toString())
);

useEffect(() => {
  console.log("Socialhub updated", allusers);
}, [allusers]);
  const navv=useNavigate()

  return (
    <div className='w-full h-full flex flex-col  p-4 gap-3 '>
      <h1 className='text-base text-gray-300 leading-relaxed font-medium'>Social Hub</h1>
      <span className={`w-fit px-3 py-1 text-xs rounded-full text-white
       ${onlineusers?.some(user=>user.toString()===userdata?._id.toString()) ? "bg-green-400/60 text-green-500/60 font-medium":"bg-purple-500/20 text-purple-300 font-medium"}`}>Online</span>

      <div className='w-[90%] h-20 flex items-center justify-center gap-3  p-1 bg-slate-900'>

        <div className={`w-[48%] h-[90%]  flex items-center justify-center cursor-pointer p-1 gap-2 hover:-translate-y-px transform duration-75
         hover:shadow-purple-400 ${currenttype==="friends" && "bg-slate-800"}`} onClick={()=>setcurrenttype("friends")}>
          <Users className='w-4 h-4'/>
          <h1 className='text-base text-gray-300 leading-relaxed font-medium'>Friends</h1>

        </div>

        <div className={`w-[48%] h-[90%]  flex items-center justify-center cursor-pointer p-1 gap-2 hover:-translate-y-px transform
         duration-75 hover:shadow-purple-400 ${currenttype==="party-chats" && "bg-slate-800"}`} onClick={()=>setcurrenttype("party-chats")}>
          <Gamepad2 className='w-4 h-4' />
            <h1 className='text-base text-gray-300 leading-relaxed font-medium'>Party Chats</h1>
        </div>

      </div>

      <div className='w-full min-h-100  flex flex-col gap-2'>
        {currenttype === "friends" ?
  allusers
    ?.filter(user => friendIds.has(user._id.toString()))
    ?.map((friend) => {

 
    

      const isOnline = onlineusers?.includes(friend._id.toString());

      return (
        <div className="w-full flex h-15 cursor-pointer items-center" onClick={()=>navv(`/privatechat/${friend._id}/${encodeURIComponent(friend?.name)}`)}>

          <div className={`avatar  ${isOnline ? "avatar-online" : "avatar-offline"}`} >
            <div className="w-12 h-12 rounded-full">
              <img src={friend?.image} />
            </div>
          </div>

          <div className="w-[80%] flex flex-col justify-center p-2">
            <h1 className="text-base text-gray-300 font-medium">
              {friend.name}
            </h1>

            <p className="text-xs text-pink-600/80 overflow-x-auto">
  {friend.currentlyPlaying
    ? `Playing ${friend.currentlyPlaying}`
    : friend.prevPlayed
    ? `Played ${friend.prevPlayed} for ${(friend.prevPlayingTime)/60} hours`
    : "Idle"}
</p>
          </div>

        </div>
      );
    }):
    userParties?.map(party=>{

    return (
  <div
    className="w-full flex items-center justify-between 
    px-5 py-3 rounded-2xl cursor-pointer 
    bg-gradient-to-r from-slate-900 to-slate-800
    border border-white/5
    hover:border-purple-500/40 
    hover:shadow-lg hover:shadow-purple-500/10
    transition-all duration-200 ease-in-out
    group"
    onClick={() => navv(`/partychat/${party?._id}`)}
  >
    {/* Party Name */}
    <div className="flex flex-col">
      <h1 className="text-sm font-semibold text-gray-200 group-hover:text-white transition">
        {party?.name}
      </h1>
      <p className="text-[10px] text-gray-500">
        Active party
      </p>
    </div>

    {/* Members */}
    <div className="flex items-center gap-3">
      
      {/* Avatars */}
      <div className="flex -space-x-2">
        {party?.members?.slice(0, 5).map((member, index) => (
          <div
            key={index}
            className="w-8 h-8 rounded-full border-2 border-slate-900 overflow-hidden 
            hover:scale-110 transition-transform duration-150"
          >
            <img
              src={member?.image}
              alt="member"
              className="w-full h-full object-cover"
              title={member?.name}
            />
          </div>
        ))}
      </div>

      {/* Count */}
      <span className="text-xs text-gray-400 font-medium">
        {party?.members?.length}
      </span>
    </div>
  </div>
);

    })
    

    
    
    
    }



      </div>
    </div>
  )
}

export default Socialhub
