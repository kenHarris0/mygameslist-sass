import React, { useContext } from 'react'
import {gamecontext} from '../Context/Context'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import Chatpage from '../components/Chatpage'
import {useSelector} from 'react-redux'
import Partychat from './Partychat'
import { div } from 'three/src/nodes/math/OperatorNode.js'


const UserMessages = () => {

  const {url,userdata,allusers,onlineusers}=useContext(gamecontext)
  const [uniqueDm,setuniqueDm]=useState([])
const [currid,setcurrid]=useState(null)
  const [currname,setcurrname]=useState(null)
  useEffect(()=>{
    if(!userdata) return;

    const handler=async()=>{
      const res=await axios.get(url+'/msg/getalluniquemessagers',{withCredentials:true})
      if(res.data.success){
        setuniqueDm(res.data.payload)

      }
    }
    handler()

  },[userdata?._id])

  console.log(uniqueDm)


const Privatedms = allusers?.filter(user =>
  uniqueDm?.map(id => id.toString()).includes(user?._id.toString())
)

//party selects
const parties=useSelector(state=>state.party.parties)

  const userparties=parties?.filter(party=>party?.members?.some(pmem=>pmem?._id?.toString()===userdata?._id?.toString()))

const [partyId,setpartyId]=useState(null)

  
  return (
    <div className='w-screen h-screen pt-17 flex'>

      <div className='w-[20%] h-full bg-[#0f172a] border-r border-gray-800 flex flex-col'>

  {/* Header */}
  <div className='px-4 py-3 border-b border-gray-800'>
    <h1 className='text-2xl font-bold text-white tracking-wide'>Messages</h1>
  </div>

  {/* Scroll area */}
  <div className='flex-1 overflow-y-auto px-2 py-3 space-y-2'>

    {/* 🔹 DM USERS */}
    {Privatedms?.map((dm) => {
      const isOnline = onlineusers?.includes(dm?._id?.toString());

      return (
        <div
          key={dm._id}
          onClick={() => {
            setpartyId(null);
            setcurrid(dm?._id);
            setcurrname(dm?.name);
          }}
          className='flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer 
          hover:bg-gray-800 transition-all duration-200'
        >
          {/* Avatar */}
          <div className={`avatar ${isOnline ? "avatar-online" : "avatar-offline"}`}>
            <div className="w-11 rounded-full ring ring-gray-700">
              <img src={dm?.image} />
            </div>
          </div>

          {/* Name */}
          <div className='flex flex-col'>
            <h1 className='text-sm font-semibold text-white truncate'>
              {dm?.name}
            </h1>
            <span className='text-[11px] text-gray-400'>
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      );
    })}

    {/* Divider */}
    <div className='border-t border-gray-800 my-2'></div>

    {/* 🔹 PARTIES */}
    {userparties?.map((party) => {
      return (
        <div
          key={party._id}
          onClick={() => {
            setcurrid(null);
            setcurrname(null);
            setpartyId(party?._id);
          }}
          className='flex flex-col gap-1 px-3 py-2 rounded-lg cursor-pointer 
          hover:bg-gray-800 transition-all duration-200'
        >

          {/* Top row */}
          <div className='flex items-center justify-between'>
            <h1 className='text-sm font-semibold text-white truncate'>
              {party?.name}
            </h1>

            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                party?.Open === "public"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {party?.Open}
            </span>
          </div>

          {/* Members */}
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {party?.members?.slice(0, 4).map((member, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border border-gray-900 overflow-hidden"
                >
                  <img
                    src={member?.image}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <span className="text-[10px] text-gray-400">
              {party?.members?.length}
            </span>
          </div>
        </div>
      );
    })}
  </div>
</div>

      {/* right part to show chat */}

      <div className='w-[80%] h-full '>
      {currid ? (
  <Chatpage uid={currid} uname={currname} />
) : partyId ? (
  <Partychat pid={partyId} isEmbedded />
) : (
  <div className="flex items-center justify-center h-full text-gray-200 font-mono text-4xl">
    Select a conversation
  </div>
)}

      </div>
      
    </div>
  )
}

export default UserMessages
