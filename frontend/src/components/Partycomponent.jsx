import React, { useContext, useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {deleteparty,updatePartyNewJoin,newpartycreated} from '../Redux/Slices/PartySlice'
import axios from 'axios'
import { gamecontext } from '../Context/Context'
import { Trash  } from 'lucide-react';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
const Partycomponent = ({gameId,gamename}) => {

const {url,userdata,socket,setuserdata,getuserdata}=useContext(gamecontext)

const dispatch=useDispatch()
//console.log(gameId,gamename)
const navv=useNavigate()


  const allparty=useSelector(state=>state.party.parties)
  
  let gameparties=[]
  if(allparty && gamename){
    gameparties=allparty.filter(party=>party.game===gamename)
  }
  //console.log(gameparties)
// join a group functionality 



const joinParty=async(partyId)=>{
  try{
    const res=await axios.post(url+'/party/join',{partyId:partyId},{withCredentials:true})
    if(res.data.success){
      dispatch(updatePartyNewJoin(res.data.payload))
    }
    

  }
  catch(err){
    console.log(err)
  }
}



//leave party
const leaveParty=async(partyId)=>{
  try{
    const res=await axios.post(url+'/party/leave',{partyId:partyId},{withCredentials:true})
    if(res.data.success){
      dispatch(updatePartyNewJoin(res.data.payload))
      getuserdata()
    }
    

  }
  catch(err){
    console.log(err)
  }
}

const deleteParty=async(partyId)=>{
try{
    const res=await axios.post(url+'/party/delete',{partyId:partyId},{withCredentials:true})
    if(res.data.success){
      dispatch(deleteparty(partyId))
     // getuserdata()
    }
    

  }
  catch(err){
    console.log(err)
  }
}

//request handling for priat parties

const sendPartyrequest=async(partyId)=>{
  try{
    const res=await axios.post(url+'/user/sendpartyreq',{partyId},{withCredentials:true})
    if(res.data.success){
      toast.success(res.data.message)
       setuserdata(prev => {
  if (!prev) return prev;

  return {
    ...prev,
    PartyRequestsSent: [
      ...(prev.PartyRequestsSent || []),
      {
        partyId: {
          _id: partyId 
        }
      }
    ]
  };
});
    }

  }
  catch(err){
    console.log(err)
  }
}










  
  return (
   <div className="w-[70%]  h-full grid grid-cols-2 gap-3 p-3 overflow-y-auto">
  { gameparties?.map((party, ind) => {
    const isUserinParty=party?.members?.some(member=>member._id?.toString()===userdata?._id?.toString())
    const alreadyRequested = userdata?.PartyRequestsSent?.some(
  req => req.partyId._id.toString() === party._id.toString()
);
    const isUserAdmin=party?.admin?.toString()===userdata?._id?.toString()
    return (
      <div
        key={ind}
        className="bg-gray-900 cursor-pointer border overflow-y-auto border-gray-700 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition flex flex-col justify-between h-22.5"
      onClick={(e) => {
  e.stopPropagation();

  if (isUserinParty || isUserAdmin) {
    navv(`/partychat/${party?._id}`);
  } else {
    toast.error("Join the party to access chat");
  }
}}
      >

        {/* Top row */}
        <div className="flex items-center justify-between">

          {/* Name */}

          <div className='flex items-center justify-start gap-2'>
<h1 className="text-xl font-semibold text-white truncate">
            {party?.name}
            
          </h1>
           {party?.admin?.toString()===userdata._id?.toString() && <Trash  className='w-3 h-3 hover:text-red-500 cursor-pointer'
           onClick={()=>deleteParty(party?._id)}
           /> }
         
          </div>
          

          {/* Status */}
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full ${
              party?.Open === "public"
                ? "bg-green-600/20 text-green-400"
                : "bg-red-600/20 text-red-400"
            }`}
          >
            {party?.Open}
          </span>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">

          {/* Members */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {party?.members?.slice(0, 5).map((member, index) => (
                <div
                  key={index}
                  className="w-7 h-7 rounded-full border border-gray-900 overflow-hidden"
                >
                  <img
                    src={member?.image}
                    alt="member"
                    className="w-full h-full object-cover "
                    title={member?.name}
                  />
                </div>
              ))}
            </div>

            <span className="text-[11px] text-gray-400">
              {party?.members?.length} Members
            </span>
          </div>

          {/* Join button */}

          {party?.Open==="public"?
          !isUserinParty  ?
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs cursor-pointer" onClick={(e)=>{
            e.stopPropagation()
            joinParty(party._id)}}>
            Join
          </button>:
            <button className="bg-red-400 hover:bg-red-600 text-white px-2 py-1 rounded text-xs cursor-pointer" onClick={(e)=>{
              e.stopPropagation()
              leaveParty(party._id)}}>
            Leave
          </button>

  :!isUserAdmin? 
  !isUserinParty  ?
  alreadyRequested?
   <button className="bg-gray-500 text-white px-2 py-1 rounded text-xs cursor-not-allowed">
      Requested
    </button>:
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs cursor-pointer" onClick={(e)=>{
            e.stopPropagation()
            sendPartyrequest(party._id)}}>
            Send Request
          </button>:
            <button className="bg-red-400 hover:bg-red-600 text-white px-2 py-1 rounded text-xs cursor-pointer" onClick={(e)=>{
              e.stopPropagation()
              leaveParty(party._id)}}>
            Leave
          </button>:
  <button className='"bg-yellow-400 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs cursor-pointer'>Hop in chief</button>
  }


  
        </div>
      </div>
    )
  })}
</div>
  )
}

export default Partycomponent
