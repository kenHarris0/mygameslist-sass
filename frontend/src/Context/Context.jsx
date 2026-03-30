import React, { Children, createContext, useEffect, useState,useRef ,useMemo} from 'react'
import axios from 'axios'
import {toast} from 'react-toastify'
import {io} from 'socket.io-client'

export const gamecontext=createContext()


const Context = ({children}) => {

    //getting user data
const[userdata,setuserdata]=useState(null)
const [searchval,setsearchval]=useState("")
    const url="http://localhost:5000"
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
}, [socket, setallusers]);  
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
  getPrivateMessages
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
