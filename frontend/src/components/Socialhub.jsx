import React, { useContext, useState } from 'react'
import {Users,Gamepad2} from 'lucide-react'
import {gamecontext} from '../Context/Context'
const Socialhub = () => {

  const {userdata,socket,onlineusers,getuserdata}=useContext(gamecontext)
  const [currenttype,setcurrenttype]=useState("friends")



  

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
        { currenttype==="friends" && (userdata?.friends?.map((friend,ind)=>{
          return(
            <div className='w-full flex h-15 '>

              <div className='w-[20%] h-full flex items-center p-2'>
                <img src={friend?.image} alt="" className='w-12 h-12 rounded-full object-cover'/>

              </div>

              <div className='w-[80%] h-full flex flex-col items-start justify-center  p-2'>
                <h1 className='text-base text-gray-300 leading-relaxed font-medium'>{friend.name}</h1>
                <p className='text-xs text-pink-600/80 leading-relaxed font-medium'>{friend.currentlyPlaying || "idle"}</p>

              </div>
              

            </div>
          )
        }))}

      </div>
    </div>
  )
}

export default Socialhub
