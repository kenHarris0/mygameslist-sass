import React, { useContext, useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {getallparties,deleteparty,updatePartyNewJoin} from '../Redux/Slices/PartySlice'
import axios from 'axios'
import { gamecontext } from '../Context/Context'
import { toast } from 'react-toastify'
const Partycomponent = ({gameId,gamename}) => {

const {url,userdata,socket}=useContext(gamecontext)

const dispatch=useDispatch()
//console.log(gameId,gamename)

  useEffect(()=>{
    if(!userdata) return;
    const fetcher=async()=>{
    const res=await axios.get(url+'/party/getallparty',{withCredentials:true})
    if(res.data.success){
      dispatch(getallparties(res.data.payload))

    }


    }

    fetcher()
  },[userdata])

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
console.log(allparty)
useEffect(()=>{
if(!socket) return;
     
const handler=(data)=>{
  const {user,party}=data
  toast.success(`${user?.name} joined the party`)
  dispatch(updatePartyNewJoin(party))
  
}

socket.on('newpartyjoin',handler)

return ()=>socket.off('newpartyjoin',handler)

},[socket])
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

useEffect(()=>{
if(!socket) return;
     
const handler=(data)=>{
  const {user,party}=data
  toast.info(`${user?.name} left the party`)
  dispatch(updatePartyNewJoin(party))
  
}

socket.on('leftpartyupdate',handler)

return ()=>socket.off('leftpartyupdate',handler)

},[socket])




useEffect(()=>{
if(!socket) return;
     
const handler=(data)=>{
  
  dispatch(updatePartyNewJoin(data))
  
}

socket.on('partyUpdated',handler)

return ()=>socket.off('partyUpdated',handler)

},[socket])





  
  return (
   <div className="w-[70%]  h-full grid grid-cols-2 gap-3 p-3">
  {gameparties?.map((party, ind) => {
    const isUserinParty=party?.members?.some(member=>member._id.toString()===userdata?._id.toString())
    console.log(isUserinParty)
    return (
      <div
        key={ind}
        className="bg-gray-900 border overflow-y-auto border-gray-700 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition flex flex-col justify-between h-22.5"
      >

        {/* Top row */}
        <div className="flex items-center justify-between">

          {/* Name */}
          <h1 className="text-xl font-semibold text-white truncate">
            {party?.name}
          </h1>

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
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs cursor-pointer" onClick={()=>joinParty(party._id)}>
            Join
          </button>:
            <button className="bg-red-400 hover:bg-red-600 text-white px-2 py-1 rounded text-xs cursor-pointer" onClick={()=>leaveParty(party._id)}>
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
