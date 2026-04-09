import React, { useContext, useEffect, useRef, useState } from 'react'
import { Gamepad2, Search, Bell, LogOut, Heart, Users } from 'lucide-react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { gamecontext } from '../Context/Context'
import axios from 'axios'
import {updatePartyNewJoin} from '../Redux/Slices/PartySlice'
import {useSelector,useDispatch} from 'react-redux'

const Navbar = () => {
  const navv = useNavigate()
  const {
    url,
    userdata,
    setuserdata,
    searchval,
    setsearchval,
    allgames,
    allusers,getuserdata,socket,setallusers
  } = useContext(gamecontext)
const dispatch=useDispatch()

  const [showdropdown, setshowdropdown] = useState(false)
  const [noticount, setnoticount] = useState(0)
  const [clickbell, setclickbell] = useState(false)

  const searchRef = useRef(null)
  const bellRef = useRef(null)

  const logout = async () => {
    try {
      const res = await axios.post(url + "/user/logout", {}, { withCredentials: true })
      if (res.data) {
        setuserdata(null)
        toast.success("logged out successfully")
        navv('/')
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const handleOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setshowdropdown(false)
      }

      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setclickbell(false)
      }
    }

    document.addEventListener("mousedown", handleOutside)
    return () => document.removeEventListener("mousedown", handleOutside)
  }, [])

  useEffect(() => {
    if (!userdata) return
    setnoticount(userdata?.friendRequestsReceived?.length+userdata?.PartyRequestsReceived?.length || 0)
  }, [userdata])

  //accept friend request

  const acceptRequest=async(id)=>{
    try{
      const res=await axios.post(url+'/user/accept',{friendId:id},{withCredentials:true})
      if(res.data.success){
        setuserdata((prev) => {
  if (!prev) return prev;

  return {
    ...prev,
    friendRequestsReceived: prev.friendRequestsReceived.filter(
      (req) => req._id.toString() !== id.toString()
    ),
  
  };
});


        
      }

    }
    catch(err){
      console.log(err)
    }
  }

    //socket handling
useEffect(() => {
  if (!socket) return;

  const handleFriendReqReceived = (data) => {
    toast.success(`New Friend request from ${data.name}`);

    setuserdata((prev) => {
      if (!prev) return prev;

      const alreadyExists = prev.friendRequestsReceived?.some(
        (req) => req._id?.toString() === data._id.toString()
      );

      if (alreadyExists) return prev;

      return {
        ...prev,
        friendRequestsReceived: [
          ...(prev.friendRequestsReceived || []),
          data,
        ],
      };
    });
  };

  socket.on("friendreqreceived", handleFriendReqReceived);

  return () => {
    socket.off("friendreqreceived", handleFriendReqReceived);
  };
}, [socket]);

//accept req socket

useEffect(() => {
  if (!socket) return;

  const handler = (data) => {
    toast.success(`${data.name} accepted your friend request :)`);

    setuserdata((prev) => {
      if (!prev) return prev;

      const alreadyExists = prev.friendRequestsSent?.some(
        (req) => req._id?.toString() === data._id.toString()
      );
      if (!alreadyExists) return prev;

      const alreadyFriend = prev.friends?.some(
        (user) => user._id?.toString() === data._id.toString()
      );

      return {
        ...prev,
        friendRequestsSent: prev.friendRequestsSent?.filter(
          (req) => req._id.toString() !== data._id.toString()
        ),
        friends: alreadyFriend
          ? prev.friends
          : [...(prev.friends || []), data],
      };
    });
  };

  socket.on("friendreqaccepted-sender", handler);

  return () => {
    socket.off("friendreqaccepted-sender", handler);
  };
}, [socket]);

useEffect(()=>{

  if(!socket) return;

  const handler=(data)=>{

    setuserdata((prev)=>{
if(!prev) return prev;
      const alreadyExists = prev.friends?.some(
        (req) => req._id?.toString() === data._id.toString()
      );
      if(alreadyExists) return prev;

      return {
        ...prev,
        friends:[
          ...(prev.friends || []),data
        ]
      }

  })


}
socket.on("friendreqaccepted-receiver", handler);

  return () => {
    socket.off("friendreqaccepted-receiver", handler);
  };
},[socket])
//reject request
    const rejectRequest=async(id)=>{
    try{
      const res=await axios.post(url+'/user/reject',{friendId:id},{withCredentials:true})
      if(res.data.success){
        
          setuserdata((prev) => {
  if (!prev) return prev;

  return {
    ...prev,
    friendRequestsReceived: prev.friendRequestsReceived.filter(
      (req) => req._id.toString() !== id.toString()
    ),
  
  };
})
        
      }

    }
    catch(err){
      console.log(err)
    }
  }
  //receiver handling the friend list + friendreqsent updation in RT
  useEffect(()=>{
    if(!socket) return
    const handler=(data)=>{

      setuserdata(prev=>{
        if(!prev) return prev;
 toast.info(`${data.name} rejected your friend request`);
      
      const alreadyinrequestSent=prev?.friendRequestsSent?.some(req=>req._id.toString()===data._id.toString())

      if(!alreadyinrequestSent) return prev;

      return{
        ...prev,
        friendRequestsSent:prev?.friendRequestsSent?.filter(fri=>fri._id.toString()!==data._id.toString()),
        

      }

      }
        
      )

    }
    socket.on("friendreqrejected-sender", handler);

  return () => {
    socket.off("friendreqrejected-sender", handler);
  };

  },[socket])


  //notification for party request handling 

  const acceptPartyrequest=async(data)=>{
    try{
      const res=await axios.post(url+'/user/acceptpartyreq',{partyId:data.partyId._id,senderId:data.senderId._id},{withCredentials:true})
      if(res.data.success){

        setuserdata(prev=>
          {
        if(!prev) return prev;
        const reqexists=prev.PartyRequestsReceived.some(req=>(req.partyId._id?.toString()===res.data.payload.partyId.toString() && req.senderId._id?.toString()===res.data.payload.userId.toString()))
        if(!reqexists){
          return prev;
        }

        return {
          ...prev,
          PartyRequestsReceived:prev.PartyRequestsReceived.filter(req=>!(req.partyId._id.toString()===res.data.payload.partyId.toString() && req.senderId._id.toString()
          ===res.data.payload.userId.toString()))
          
        }
      }
        )

dispatch(updatePartyNewJoin(res.data.payload.party))
      }
      

    }
    catch(err){
      console.log(err)
    }
  }


  const rejectPartyrequest=async(data)=>{
    try{
      const res=await axios.post(url+'/user/rejectpartyreq',{partyId:data.partyId._id,senderId:data.senderId._id},{withCredentials:true})
      if(res.data.success){
         setuserdata(prev=>
          {
        if(!prev) return prev;
        const reqexists=prev.PartyRequestsReceived.some(req=>req.partyId._id.toString()===res.data.payload.partyId.toString() && req.senderId._id.toString()===res.data.payload.userId.toString())
        if(!reqexists){
          return prev;
        }

        return {
          ...prev,
          PartyRequestsReceived:prev.PartyRequestsReceived.filter(req=>!(req.partyId._id.toString()===res.data.payload.partyId.toString() && req.senderId._id.toString()
          ===res.data.payload.userId.toString()))
          
        }
      }
        )

      }

    }
    catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    if(!socket){
      return;
    }

    const requesthandler=(data)=>{
      toast.info(`${data.name} requested to join party ${data.partyname}`)
      setuserdata(prev=>{
        if(!prev) return prev;
        const reqexists=prev.PartyRequestsReceived.some(req=>req.partyId?._id?.toString()===data.partyId.toString() && req.senderId._id?.toString()===data._id.toString())
        if(reqexists){
          return prev;
        }

        return {
          ...prev,
          PartyRequestsReceived:[
            ...(prev.PartyRequestsReceived || []),
            {
              partyId:{
                _id:data.partyId,
                name:data.partyname
              },
              senderId:{
                _id:data._id,
                name:data.name,
                image:data.image
              }
            }
          ]
          
        }
      })
    }

    const accepthandler=(data)=>{
      toast.success(`${data.name} accepted your join request to ${data.partyname}`)
      dispatch(updatePartyNewJoin(data.party))

      setuserdata(prev=>{
         if (!prev) return prev;
         return {
          ...prev,
          PartyRequestsSent:prev?.PartyRequestsSent?.filter(req=>!(req.partyId?._id.toString()===data.partyId?.toString() && req.receiverId?._id?.toString()===data.adminId?.toString()))
         }
      })
    }

    const rejecthandler=(data)=>{
      toast.error(`${data.name} rejected your join request to ${data.partyname}`)
      setuserdata(prev=>{
         if (!prev) return prev;
         return {
          ...prev,
          PartyRequestsSent:prev?.PartyRequestsSent?.filter(req=>!(req.partyId?._id?.toString()===data.partyId?.toString() && req.receiverId?._id?.toString()===data.adminId?.toString()))
         }
      })
    }



    socket.on('party-req-received',requesthandler)
    socket.on('party-req-accepted',accepthandler)
    socket.on('party-req-rejected',rejecthandler)

    return ()=>{
      socket.off('party-req-received',requesthandler)
socket.off('party-req-accepted',accepthandler)
    socket.off('party-req-rejected',rejecthandler)
    }




  },[socket,setuserdata])


 






  return (
    <div className='w-full h-16 bg-slate-900 text-white flex items-center justify-between px-6 fixed top-0 left-0 z-50 shadow-md'>
      
      {/* Logo */}
      <div
        className='flex items-center gap-2 cursor-pointer min-w-fit'
        onClick={() => navv('/')}
      >
        <Gamepad2 className='w-8 h-8 animate-pulse' />
        <h1 className='text-2xl font-bold'>MyGamesList</h1>
      </div>

      {/* Search */}
      <div className='w-[32%] relative' ref={searchRef}>
        <div className='relative'>
          <input
            type="text"
            className='w-full h-10 bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-3 outline-none focus:ring-2 focus:ring-purple-600 placeholder:text-gray-400'
            placeholder="Search Players, Groups, Games"
            value={searchval}
            onChange={(e) => {
              const val = e.target.value
              setsearchval(val)
              setshowdropdown(val.trim().length > 0)
            }}
          />
          <Search className='w-4 h-4 absolute left-3 top-3 text-gray-400' />
        </div>

        {showdropdown && (
          <div className='absolute top-12 left-0 w-full max-h-80 overflow-y-auto rounded-xl border border-slate-700 bg-slate-950 shadow-xl p-2 z-50'>
            
            {allgames
              ?.filter((game) =>
                game?.name?.toLowerCase().includes(searchval.toLowerCase())
              )
              .slice(0, 8)
              .map((game, ind) => (
                <div
                  key={ind}
                  className='w-full min-h-20 px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center justify-between cursor-pointer transition'
                  onClick={() => window.open(game.url, "_blank")}
                >
                  <div className='flex items-center gap-3 w-[80%]'>
                    <img
                      src={game.photo}
                      alt={game.name}
                      className='w-14 h-14 rounded-md object-cover'
                    />
                    <h1 className='font-medium truncate'>{game.name}</h1>
                  </div>

                  <div className='flex items-center gap-1 text-sm text-pink-400'>
                    <Heart className='w-4 h-4' />
                    <span>{game.rating}</span>
                  </div>
                </div>
              ))}

            {allusers
              ?.filter((user) =>
                user?.name?.toLowerCase().includes(searchval.toLowerCase())
              )
              .slice(0, 5)
              .map((user, ind) => (
                <div
                  key={ind}
                  className='w-full min-h-13.75 px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center justify-between cursor-pointer transition'
                >
                  <div className='flex items-center gap-3'>
                    <img
                      src={user.image}
                      alt={user.name}
                      className='w-10 h-10 rounded-full object-cover'
                    />
                    <h1 className='font-medium'>{user?.name}</h1>
                  </div>

                  <Users className='w-4 h-4 text-gray-400' />
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Nav links */}
      <div className='flex items-center gap-6 text-sm font-medium'>
        <p className='cursor-pointer hover:text-purple-400 transition' onClick={() => navv('/games')}>
          Discover
        </p>
        <p className='cursor-pointer hover:text-purple-400 transition' onClick={() => navv('/souls')}>
          Souls
        </p>
      
        <p className='cursor-pointer hover:text-purple-400 transition'  onClick={() => navv('/usermessages')}>
          Messages
        </p>
      </div>

      {/* Right section */}
      <div className='flex items-center gap-5 relative'>
        <div className='relative' ref={bellRef}>
          <Bell
            className='w-6 h-6 cursor-pointer hover:text-purple-400 transition'
            onClick={() => setclickbell((prev) => !prev)}
          />

          {noticount > 0 && (
            <span className='absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]'>
              {noticount}
            </span>
          )}

          {clickbell && (
            <div className='absolute right-0 top-10 w-80 max-h-96 overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl p-4 z-50'>
              <h2 className='text-sm font-semibold mb-3 text-gray-300'>Notifications</h2>

              {userdata?.friendRequestsReceived?.length > 0 ? (
                userdata.friendRequestsReceived.map((req, ind) => (
                  <div key={ind} className='flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 mb-2'>
                    <img
                      src={req.image}
                      alt={req.name}
                      className='w-10 h-10 rounded-full object-cover'
                    />

                    <div className='flex-1'>
                      <h1 className='text-sm font-semibold'>{req.name}</h1>
                    </div>

                    <div className='flex gap-2'>
                      <button className='px-3 py-1 text-xs rounded-md bg-green-500/20 hover:bg-green-500/30 cursor-pointer' onClick={()=>acceptRequest(req._id)}>
                        Accept
                      </button>
                      <button className='px-3 py-1 text-xs rounded-md bg-red-500/20 hover:bg-red-500/30 cursor-pointer' onClick={()=>rejectRequest(req._id)}>
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-sm text-gray-400'>No notifications</p>
              )}

              {
                userdata.PartyRequestsReceived.map((req, ind) => (
                  <div key={ind} className='flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 mb-2'>
                    <img
                      src={req.senderId?.image}
                      alt={req.senderId?.name}
                      className='w-10 h-10 rounded-full object-cover'
                    />

                    <div className='flex-1'>
                      <h1 className='text-sm font-semibold'>{req.senderId?.name}</h1>
                    </div>

                    <div className='flex gap-2'>
                      <button className='px-3 py-1 text-xs rounded-md bg-green-500/20 hover:bg-green-500/30 cursor-pointer' onClick={()=>acceptPartyrequest(req)}>
                        Accept
                      </button>
                      <button className='px-3 py-1 text-xs rounded-md bg-red-500/20 hover:bg-red-500/30 cursor-pointer' onClick={()=>rejectPartyrequest(req)}>
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              }


            </div>
          )}
        </div>

        {!userdata ? (
          <img
            src="./image.png"
            alt="profile"
            className='w-10 h-10 rounded-full cursor-pointer bg-white object-cover'
            onClick={() => navv('/login')}
          />
        ) : (
          <div className='flex items-center gap-4'>
            <img
              src={userdata?.image}
              alt="profile"
              className='w-10 h-10 rounded-full cursor-pointer bg-white object-cover border border-slate-600'
              onClick={() => navv('/profile')}
            />
            <LogOut
              className='w-5 h-5 cursor-pointer hover:text-red-400 transition'
              onClick={logout}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar