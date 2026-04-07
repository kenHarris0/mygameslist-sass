import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { gamecontext } from '../Context/Context'
import { Share2 } from 'lucide-react';
import { CirclePlay,BookmarkCheck,Bookmark,CircleCheckBig  } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

import Partycomponent from '../components/Partycomponent';


const Gamedesc = () => {

  const {id}=useParams()
  const {userdata,allgames,url,getuserdata,socket,allusers,onlineusers,sendFriendReq}=useContext(gamecontext)
  const [userstatus,setuserstatus]=useState("")
  
  const currgame = userdata?.games?.find(
  (g) => g.game?._id?.toString() === id?.toString()
);
 useEffect(() => {
    if (currgame?.status) {
      setuserstatus(currgame.status)
    }
  }, [currgame])

const navv=useNavigate()



const startThisgame=async()=>{
  try{
    const res=await axios.post(url+"/game/startgame",{gameId:id},{withCredentials:true})
    if(res.data.success){
      setuserstatus("Playing")
      

      toast.success(`status changed to Playing`)
    }
    else {
      toast.error(res.data.message);
    }

  }
  catch(err){
    console.log(err)
  }
}

const stopThisgame = async () => {
  try {
    const res = await axios.post(url + "/game/timeplayed", { gameId: id }, { withCredentials: true });

    if (res.data.success) {
      setuserstatus("Completed");
      await getuserdata();
      toast.success("game has been completed");
    } else {
      toast.error(res.data.message);
    }
  } catch (err) {
    console.log(err);
    toast.error("something went wrong");
  }
};

const awayThisgame = async () => {
  try {
    const res = await axios.post(
      url + "/game/away",
      { gameId: id },
      { withCredentials: true }
    );

    if (res.data.success) {
      setuserstatus("Away");
      toast.success("status changed to Away");
    } else {
      toast.error(res.data.message);
    }
  } catch (err) {
    console.log(err);
  }
};

const [currentlyPlayers, setCurrentlyPlayers] = useState([]);

useEffect(() => {
  if (!allusers || !currgame) return;

  const filtered = allusers.filter(
    user => user?.currentlyPlaying === currgame?.game?.name
  );

  setCurrentlyPlayers(filtered);
}, [allusers, currgame]);

//create party feature







  return (
  <div className='w-full min-h-screen flex flex-col gap-5 bg-slate-950 text-white'>
  <div className='w-[80%] mx-auto flex items-start justify-evenly mt-20 p-6 gap-10 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl'>

    <div className='w-[40%] h-90 rounded-2xl overflow-hidden border border-white/10 shadow-lg'>
      <img
        src={currgame?.game?.photo}
        alt={currgame?.game?.name}
        className='w-full h-full object-cover'
      />
    </div>

    <div className='w-[60%] h-90 p-4 flex flex-col justify-between'>

      <div>
        <p className='text-sm uppercase tracking-[0.25em] text-purple-400 mb-2'>
          Game Overview
        </p>
        <h1 className='text-4xl font-extrabold tracking-tight'>
          {currgame?.game?.name}
        </h1>
        <p className='text-slate-400 mt-2 text-sm'>
          Jump in, track your progress, and launch your next session instantly.
        </p>
      </div>

      <div className='w-full min-h-20 rounded-2xl bg-slate-800/70 border border-white/10 px-5 py-4 flex items-center'>
        <ul className='flex justify-start items-center gap-8 text-sm text-slate-300 font-medium'>
          <li className='flex flex-col'>
            <span className='text-xs text-slate-500'>Players Online</span>
            <span className='text-lg font-bold text-white'>0</span>
          </li>
          <li className='flex flex-col'>
            <span className='text-xs text-slate-500'>Time Clocked</span>
            <span className='text-lg font-bold text-white'>{currgame?.totalTimePlayed} Mins</span>
          </li>
        </ul>
      </div>

      <div className='flex items-center justify-start gap-3 flex-wrap'>
        {currgame?.game?.genres?.map((genre, ind) => {
          return (
            <span
              key={ind}
              className='w-fit px-4 py-2 text-xs rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-400/20'
            >
              {genre}
            </span>
          )
        })}
      </div>

      <div className='flex items-center justify-between w-[60%]'>
        <button className='w-40 h-12 rounded-full border-0 bg-linear-to-r from-pink-500 to-purple-500 text-white text-base font-bold shadow-lg hover:scale-105 transition duration-200 cursor-pointer'
        onClick={()=>window.open(currgame?.game?.url,"_blank")}>
          Launch Game
        </button>

        <div className='w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center cursor-pointer hover:text-blue-400 hover:scale-110 transition duration-200'>
          <Share2 className='w-5 h-5' />
        </div>
      </div>

    </div>

  </div>

  <div className='w-[80%] mx-auto h-100 gap-5 rounded-2xl flex'>

{/*currently playing users*/}

    <div className='w-[70%] h-100 rounded-2xl border-4 border-white/10 p-6 bg-slate-900/60 backdrop-blur-lg shadow-xl flex flex-col'>

  {/* Header */}
  <h1 className='text-3xl font-extrabold text-slate-200 tracking-wide mb-4'>
    Currently Playing
  </h1>

  {/* Scrollable Grid */}
  <div className='flex-1  overflow-y-auto pr-2'>
    <div className='grid grid-cols-2 gap-4 p-3'>

      {currentlyPlayers?.length > 0 ? (
        currentlyPlayers.map((user, ind) => {
          const gamestatus = user?.games?.find(game => game.status);
          const isafriend = userdata?.friends?.find(
            fri => fri._id.toString() === user._id.toString()
          );

          const hassentrequest=userdata?.friendRequestsSent?.find(req=>req._id.toString()===user._id.toString())

          return (
            <div
              key={ind}
              className='group flex items-center gap-4 p-4 rounded-xl bg-slate-800/60 border border-white/10 hover:bg-slate-700/70 hover:scale-[1.02] transition duration-200 shadow-md'
            >
              
              {/* Avatar */}
              <div className='relative'>
                <img
                  src={user?.image}
                  alt={user?.name}
                  className='w-14 h-14 rounded-full object-cover border border-white/10'
                />

                {/* Online Indicator */}
                <span
                  className={`absolute top-0 right-0.5 w-3 h-3 rounded-full border-2 border-slate-900
                  ${onlineusers?.includes(user?._id) ? "bg-green-500" : "bg-gray-500"}`}
                />
              </div>

              {/* Info */}
              <div className='flex flex-col flex-1'>
                <p className='text-lg font-semibold text-white leading-tight'>
                  {user?.name}
                </p>

                <p className='text-xs text-slate-400'>
                  {user?.status || "Idle"}
                </p>

                {/* Status Badge */}
                <span
                  className={`mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit
                  ${gamestatus?.status === "Playing" && "bg-green-500/20 text-green-400"}
                  ${gamestatus?.status === "Away" && "bg-yellow-500/20 text-yellow-400"}
                  ${gamestatus?.status === "Completed" && "bg-blue-500/20 text-blue-400"}
                `}
                >
                  {gamestatus?.status || "Unknown"}
                </span>
              </div>

              {/* Action Button */}
              <div className='opacity-80 group-hover:opacity-100 transition'>
                {!isafriend ? !hassentrequest ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sendFriendReq(user?._id)}
                    }
                    className='px-3 py-1 text-xs font-semibold rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/40 transition'
                  >
                    Add
                  </button>
                ):(
                  <button  className='px-3 py-1 text-xs font-semibold rounded-lg bg-yellow-500/20 text-purple-2 *:00 hover:bg-yellow-500/40 transition'>
                     Pending...
                  </button>
                ) : (
                  <span className='text-green-400 text-xs font-semibold'>
                    ✓ Friend
                  </span>
                )}
              </div>

            </div>
          );
        })
      ) : (
        <div className='col-span-2 flex justify-center items-center h-40 text-slate-500 text-lg'>
          No one is playing this game 😴
        </div>
      )}

    </div>
  </div>
</div>
    
    <div className='w-[30%] h-full rounded-3xl border-4 border-white/10 bg-slate-900/80 shadow-xl backdrop-blur-sm flex flex-col p-6 gap-6'>

  <h1 className='text-2xl font-bold text-slate-300 tracking-wide'>
    YOUR STATUS
  </h1>

  <div className='w-full flex flex-col items-center gap-4'>

    <div className='w-[90%] flex items-center justify-start gap-4 border border-white/10 p-4 rounded-2xl bg-linear-to-r from-violet-500/90
     to-violet-800/90 shadow-md hover:scale-[1.02] transition duration-200 cursor-pointer' onClick={
      ()=>
        startThisgame()
    
     }>
      <div className='w-10 h-10 rounded-full bg-white/10 flex items-center justify-center'>
        <CirclePlay className='w-5 h-5 text-white' />
      </div>
      <h1 className={`text-xl font-extrabold text-white tracking-wide ${userstatus==="Playing" && "animate-pulse"}`}>
        Playing
      </h1>
      {userstatus==="Playing" && <CircleCheckBig className='w-3 h-3'/>}
    </div>

    <div className='w-[90%] flex items-center justify-start gap-4 border border-white/10 p-4 rounded-2xl bg-linear-to-r from-emerald-500/90 to-teal-700/90 
    shadow-md hover:scale-[1.02] transition duration-200 cursor-pointer' onClick={()=>stopThisgame()}>
      <div className='w-10 h-10 rounded-full bg-white/10 flex items-center justify-center'>
        <BookmarkCheck className='w-5 h-5 text-white' />
      </div>
      <h1 className={`text-xl font-extrabold text-white tracking-wide ${userstatus==="Completed" && "animate-pulse"}`}>
        Completed
      </h1>
{userstatus==="Completed" && <CircleCheckBig className='w-3 h-3'/>}
    </div>

    <div className='w-[90%] flex items-center justify-start gap-4 border border-white/10 p-4 rounded-2xl bg-linear-to-r from-yellow-500/90
     to-yellow-700/90 shadow-md hover:scale-[1.02] transition duration-200 cursor-pointer' onClick={()=>awayThisgame()}>
      <div className='w-10 h-10 rounded-full bg-white/10 flex items-center justify-center'>
        <Bookmark className='w-5 h-5 text-white' />
      </div>
      <h1 className={`text-xl font-extrabold text-white tracking-wide ${userstatus==="Away" && "animate-pulse"}`}>
        Away
      </h1>
      {userstatus==="Away" && <CircleCheckBig className='w-3 h-3'/>}
      
    </div>

  </div>

</div>

  </div>
{/* PARTY PART AT THE BOTTOM                                           */}
  <div className='w-[80%] mx-auto h-100 border-4 border-gray-500 rounded-2xl flex flex-col p-4'>
    <div className='flex w-full items-center justify-between p-2'>
<h1 className='text-3xl font-extrabold text-slate-200 tracking-wide mb-4'>Partie's available</h1>

<button className='w-40 h-12 rounded-full border-0 bg-linear-to-r from-pink-500 to-purple-500 text-white text-base font-bold 
shadow-lg hover:scale-105 transition duration-200 cursor-pointer' onClick={()=>navv(`/createparty/${encodeURIComponent(currgame?.game?.name)}/${currgame?.game?._id}`)}>Create party</button>
    </div>
    
    <Partycomponent gameId={currgame?._id} gamename={currgame?.game?.name}/>

  </div>

  
</div>
  )
}

export default Gamedesc
