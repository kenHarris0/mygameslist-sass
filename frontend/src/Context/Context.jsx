import React, { Children, createContext, useEffect, useState,useRef } from 'react'
import axios from 'axios'


export const gamecontext=createContext()


const Context = ({children}) => {

    //getting user data
const[userdata,setuserdata]=useState(null)
const [searchval,setsearchval]=useState("")
    const url="http://localhost:5000"


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

    const [allgames,setallgames]=useState([])
    const getallgames=async()=>{
         if (allgames.length > 0) return;
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

    useEffect(()=>{
        checkauth()
        

    },[])

useEffect(()=>{
    getallgames()
},[userdata])



    console.log(allgames)
const value={
    url,userdata,setuserdata,checkauth,getuserdata,
    allgames,setallgames,getallgames, // games related
    searchval,setsearchval // for search bar

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
