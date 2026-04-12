import React, { Children, createContext, useEffect, useState,useRef ,useMemo} from 'react'
import axios from 'axios'
import {toast} from 'react-toastify'
import {io} from 'socket.io-client'

export const gamecontext=createContext()


const Context = ({children}) => {

    //getting user data
const[userdata,setuserdata]=useState(null)
const [searchval,setsearchval]=useState("")
    const url="https://mygameslist-sass.onrender.com"
    //
const [socket,setsocket]=useState(null)

//checking auth for session
    const checkauth=async()=>{
        try{
            const res=await axios.get(url+"/user/checkauth",{withCredentials:true})
            if(res.data.success){
              await getuserdata()
            }
            else{
                setuserdata(null);
            }


        }
        catch(err){
            console.log(err)
            setuserdata(null);
        }
    }

//getting user data
const getuserdata=async()=>{
        try{
            const res=await axios.get(url+"/user/getuserdata",{withCredentials:true})
            if(res.data.success){
                setuserdata(res.data.payload)

            }


        }
        catch(err){
            console.log(err)
        }
    }


  

    //getting the game

    const [allgames,setallgames]=useState(null)
    const getallgames=async()=>{
         if (allgames) return;
        try{
            const res=await axios.get(url+"/game/getgames",{withCredentials:true})
            if(res.data.success){
                setallgames(res.data.payload)

            }

        }
        catch(err){
            console.log(err)
        }
    }

    //adding games to user's 

    const addGametoUser=async(gameId)=>{
        try{
            const res=await axios.post(url+"/game/addgametouser",{gameId},{withCredentials:true})
            if(res.data.success){

                toast.success("game added successfully")
                getuserdata()
            }

        }
        catch(err){
            console.log(err)
        }
    }

    const [onlineusers,setonlineusers]=useState(null)
    const connectSocket=async()=>{
        if(!userdata) return;
        try{
            if(socket){
                socket.disconnect()
                setsocket(null)
            }

            const soc=io(url,{
                withCredentials:true
            })
            setsocket(soc)

            soc.on('onlineusers',(onlines)=>{
                setonlineusers(onlines)
            })
            
            


        }
        catch(err){
            console.log(err)
        }
    }
    //getallysers
    const [allusers,setallusers]=useState(null)
    const getallusers=async()=>{
        try{
            const res=await axios.get(url+"/user/getall",{withCredentials:true})
            if(res.data.success){
               setallusers(res.data.payload)
            }

        }
        catch(err){
            console.log(err)
        }
    }

    const [Privatemessages,setPrivatemessages]=useState(null)

    const getPrivateMessages=async(id)=>{
        try{
            const res=await axios.post(url+'/msg/get',{receiverId:id},{withCredentials:true})
            if(res.data.success){
                setPrivatemessages(res.data.payload)

            }

        }
        catch(err){
            console.log(err)
        }
    }
useEffect(() => {
  if (!socket) return;

  const handler = ({ _id, gameId, currentlyPlaying, status, prevPlayed, prevPlayingTime }) => {
    setallusers(prev =>
      prev.map(user => {
        if (user._id.toString() !== _id.toString()) return user;

        return {
          ...user,
          currentlyPlaying: currentlyPlaying ?? user.currentlyPlaying,
          prevPlayed: prevPlayed ?? user.prevPlayed,
          prevPlayingTime: prevPlayingTime ?? user.prevPlayingTime,
          games: user.games.map(g =>
            g.game?._id?.toString() === gameId?.toString()
              ? { ...g, status: status ?? g.status }
              : g
          )
        };
      })
    );
  };

  socket.on("userCurrentPlaying", handler);
  return () => socket.off("userCurrentPlaying", handler);

//frined req handling or sending part
  


}, [socket, setallusers]);  


const sendFriendReq=async(id)=>{
  try{
    const res=await axios.post(url+'/user/sendreq',{friendId:id},{withCredentials:true})
    if(res.data.success){
      toast.success("friend request sent successfully")
     
    }

  }
  catch(err){
    console.log(err)
  }
}

useEffect(()=>{
if(!socket) return;

const handler=(data)=>{

  setuserdata(prev=>{
    if(!prev) return prev;
    const alreadyinSent=prev?.friendRequestsSent?.some(req=>req._id.toString()===data._id.toString())
    if(alreadyinSent){
      return prev;
    }

    return{
      ...prev,
      friendRequestsSent:[
        ...(prev.friendRequestsSent),data
      ]
    }
  })

}
const profilechange=(data)=>{

    setallusers(prev=>{
        if(!prev) return;
          
       
      return prev.map(users=>{
        if(users?._id.toString()===data._id.toString()){
                 
            return {
                ...users,
                image:data.image
            }
        }
        
            return users;
        
      })
        
    })
}

const profiledatachange=(data)=>{
    setallusers(prev=>{
        if(!prev) return;
          
       
      return prev.map(users=>{
        if(users?._id.toString()===data._id.toString()){
                 
            return {
                ...users,
                name:data.name,
                 bio:data.bio,
                  status:data.status
            }
        }
        
            return users;
        
      })
        
    })
}

const handlenewuser=(data)=>{
    setallusers(prev=>{
        if(!prev) return prev;

        const alreadyexists=prev.some(user=>user?._id?.toString()===data?._id?.toString())
        if(alreadyexists){
            return prev;
        }

        return [
            ...prev,
            data
        ]
    })
}


  socket.on('friendreqsent',handler)
  socket.on('profile-pic-changed',profilechange)
  socket.on('profile-data-changed',profiledatachange)
  socket.on('new-user',handlenewuser)
  return ()=>{
    socket.off('friendreqsent', handler)
socket.off('profile-pic-changed',profilechange)
  socket.off('profile-data-changed',profiledatachange)
  socket.off('new-user',handlenewuser)
  }

},[socket])


useEffect(()=>{
        checkauth()
},[])

useEffect(()=>{
    
    getallgames()
    connectSocket()
    getallusers()
},[userdata])



const value = {
  url,
  userdata,
  setuserdata,
  checkauth,
  getuserdata,

  allgames,
  setallgames,
  getallgames,

  searchval,
  setsearchval,

  addGametoUser,

  socket,
  connectSocket,
  onlineusers,
  getallusers,
  allusers,
  setallusers,

  Privatemessages,
  setPrivatemessages,
  getPrivateMessages,

  sendFriendReq,

}

  return (
    <div>
        <gamecontext.Provider value={value}>
             {children}
        </gamecontext.Provider>
      
    </div>
  )
}

export default Context
