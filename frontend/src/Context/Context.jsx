import React, { Children, createContext, useEffect, useState } from 'react'



export const gamecontext=createContext()


const Context = ({children}) => {

    //getting user data
const[userdata,setuserdata]=useState(null)

    const url="http://localhost:5000"


//checking auth for session
    const checkauth=async()=>{
        try{
            const res=await axios.get(url+"/user/checkauth",{withCredentials:true})
            if(res.data.success){
              await getuserdata()
            }


        }
        catch(err){
            console.log(err)
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


    useEffect(()=>{
        checkauth()

    },[])

    
const value={
    url,userdata,setuserdata,checkauth,getuserdata

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
