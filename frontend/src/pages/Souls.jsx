import React, { useContext, useEffect, useState } from 'react'
import { gamecontext  } from '../Context/Context'
import { UserPlus,Clock } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const Souls = () => {
    const {url,allusers,userdata,getuserdata,socket,getallusers,setallusers,onlineusers,setuserdata,sendFriendReq}=useContext(gamecontext)
const navv=useNavigate()

useEffect(() => {
  getallusers();
 
}, []);

const [searchfilter,setsearchfilter]=useState("")
const [filtertype,setfiltertype]=useState("user")





  return (
   <div className='w-[80%] mx-auto min-h-screen flex flex-col items-start justify-start pt-20'>
  <p className='font-black text-gray-300 leading-relaxed mb-4 tracking-widest'>
    COMMUNITY HUB
  </p>

  <h1 className='text-7xl font-extrabold mb-7'>
    FIND YOUR <span className='text-purple-500'>SQUAD</span>
  </h1>

  <div className='w-2/3 flex flex-col items-start gap-5 mb-8'>
    <input
      type="text"
      placeholder='Search by game or name'
      value={searchfilter}
      onChange={(e)=>setsearchfilter(e.target.value)}
      className='border border-white/10 bg-white/5 w-full h-13 rounded-3xl text-sm text-white placeholder:text-white/40 px-4 outline-none focus:border-purple-500'
    />

    <div className='w-full flex gap-4 items-center justify-start'>
      <span className={`px-4 py-2 cursor-pointer text-xs rounded-full ${filtertype==="user"?"bg-purple-500/20 text-purple-300 font-medium border border-purple-400/20":"bg-white/5 text-white/70 font-medium border border-white/10"} `}
      onClick={()=>setfiltertype("user")}>
        All players
      </span>
      <span className={`px-4 py-2 cursor-pointer text-xs rounded-full ${filtertype==="game"?"bg-purple-500/20 text-purple-300 font-medium border border-purple-400/20":"bg-white/5 text-white/70 font-medium border border-white/10"}`}
      onClick={()=>setfiltertype("game")}>
        Game
      </span>
    </div>
  </div>

  <div className='w-full overflow-y-auto grid grid-cols-4 gap-5 border border-white/20 rounded-2xl p-5 bg-white/5'>
    {allusers
    ?.filter((usr) => {
      if (filtertype === "user") {
        return usr.name
          ?.toLowerCase()
          ?.includes(searchfilter.toLowerCase());
      } else {
        return usr.currentlyPlaying
  ?.toLowerCase()
  ?.includes(searchfilter.toLowerCase()) || false;
       
      }
    })
    .map((user) => {

    const currgame=user?.games?.find(game=>game.game.name===user.currentlyPlaying)
    const isawayingame=currgame?.status==="Away"

    const prevplayed=user?.prevPlayed
    const prevplayedtime=user?.prevPlayingTime

const isonline=onlineusers?.some(usr=>usr.toString()===user._id.toString())
   
const haveSentReq=userdata?.friendRequestsSent.some(req=>req?._id.toString()===user._id.toString())
const isafrined=userdata?.friends.some(fri=>fri?._id.toString()===user._id.toString())
      return (
        <div
          key={user._id}
          className='w-full min-h-80 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 flex flex-col justify-between shadow-lg hover:scale-[1.02]
           hover:border-purple-400/30 transition-all duration-300'
           onClick={()=>navv(`/privatechat/${user._id}/${encodeURIComponent(user.name)}`)}
        >
          <div>
            <div className='w-full flex items-center gap-4 mb-4'>
              <div className={`avatar avatar-${isonline?"online":"offline"}`}>
<img
                src={user.image}
                alt=""
                className='w-20 h-20 object-cover rounded-full border-2 border-purple-400/30 shadow-md'
              />
              </div>
              

              <div className='flex flex-col'>
                <h1 className='text-xl font-extrabold leading-relaxed text-white'>
                  {user.name}
                </h1>
                <p className='text-sm text-white/50'>
                  {user.status || "Player status not set"}
                </p>
              </div>
            </div>

            <div className='space-y-3'>
              <div className='rounded-2xl bg-white/5 border border-white/10 p-3'>
                <p className='text-xs uppercase tracking-wider text-purple-300 mb-1'>
                  Bio
                </p>
                <p className='text-sm text-white/80'>
                  {user.bio || "Player bio not set"}
                </p>
              </div>

              <div className='rounded-2xl bg-white/5 border border-white/10 p-3'>
                <p className='text-xs uppercase tracking-wider text-purple-300 mb-1'>
                  Activity
                </p>
                <p className='text-sm text-white/80'>
                 {isawayingame
    ? `Away from ${user.currentlyPlaying}`
    : user.currentlyPlaying
    ? `Playing ${user.currentlyPlaying} Currently`
    : user.prevPlayed
    ? `Last played ${prevplayed} for ${prevplayedtime} mins`
    : "Idle"}
                </p>
              </div>
            </div>
          </div>
          {isafrined?<button className='cursor-pointer w-full mt-5 h-12 flex justify-center items-center gap-3 rounded-2xl font-semibold transition-all duration-300 border
    bg-green-800/10 text-gray-100/80 border-green-400/30 hover:bg-green-500/20 hover:scale-[1.02]'> Friends</button>:
<button
  onClick={(e) => {
    e.stopPropagation();
    sendFriendReq(user._id)}}
  className={`cursor-pointer w-full mt-5 h-12 flex justify-center items-center gap-3 rounded-2xl font-semibold transition-all duration-300 border
    ${
      haveSentReq
        ? "bg-yellow-500/10 border-yellow-400/30 text-yellow-200 hover:bg-yellow-500/15"
        : "bg-purple-500/20 border-purple-400/30 text-purple-200 hover:bg-purple-900/30 hover:scale-[1.02]"
    }`}
>
  {haveSentReq ? (
    <Clock className='w-5 h-5 animate-pulse' />
  ) : (
    <UserPlus className='w-5 h-5' />
  )}
  <span>{haveSentReq ? "Pending..." : "Add Friend"}</span>
</button>
}
        </div>
      );
    })}
  </div>
</div>
  )
}

export default Souls
