import React, { useContext, useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {deleteparty,updatePartyNewJoin,newpartycreated} from '../Redux/Slices/PartySlice'
import axios from 'axios'
import { gamecontext } from '../Context/Context'
import { Trash  } from 'lucide-react';

import { useNavigate } from 'react-router-dom'
const Partycomponent = ({gameId,gamename}) => {

const {url,userdata,socket}=useContext(gamecontext)

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
    }
    

  }
  catch(err){
    console.log(err)
  }
}












  
  return (
   <div className="w-[70%]  h-full grid grid-cols-2 gap-3 p-3 overflow-y-auto">
  {gameparties?.map((party, ind) => {
    const isUserinParty=party?.members?.some(member=>member._id.toString()===userdata?._id.toString())
    console.log(isUserinParty)
    return (
      <div
        key={ind}
        className="bg-gray-900 cursor-pointer border overflow-y-auto border-gray-700 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition flex flex-col justify-between h-22.5"
      onClick={(e)=>{
        e.stopPropagation()
        navv(`/partychat/${party?._id}`)
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
          {!isUserinParty ?
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
  }
        </div>
      </div>
    )
  })}
</div>
  )
}

export default Partycomponent
