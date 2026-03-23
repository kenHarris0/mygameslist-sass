import React, { useContext, useEffect, useRef, useState } from 'react'
import { Gamepad2,Search,Bell,LogOut,Heart, Users  } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { gamecontext } from '../Context/Context';
import axios from 'axios';
const Navbar = () => {

const navv=useNavigate()
const {url,userdata,setuserdata,getuserdata,checkauth,searchval,setsearchval,allgames,allusers}=useContext(gamecontext)
const [showdropdown,setshowdropdown]=useState(false)
const clickOutsideref=useRef(null)

const logout=async()=>{
  try{
    const res=await axios.post(url+"/user/logout",{},{withCredentials:true});
    if(res.data){
      setuserdata(null)
      toast.success("logged out successfully ")

      
        
        navv('/')

        
     
    }

  }
  catch(err){
    console.log(err)
  }
}

useEffect(()=>{
  const handleoutside=(e)=>{
    if(showdropdown && clickOutsideref && !clickOutsideref.current.contains(e.target)){
           setshowdropdown(false)
    }
  }

  document.addEventListener("mousedown",handleoutside)

  return ()=>document.removeEventListener("mousedown",handleoutside)

},[showdropdown])

  return (
    <div className='w-screen h-17.5 bg-slate-900  flex items-center justify-start gap-10 p-1 pl-3 fixed top-0 z-999'>

        <div className='w-[15%] h-[80%] flex items-center justify-start cursor-pointer ' onClick={()=>navv('/')}>
               <Gamepad2 className='w-10 h-10 animate-pulse' />
               <h1 className='text-3xl text-center pl-2 font-bold '>MyGamesList</h1>


        </div>

        <div className='w-[30%] h-full flex items-center justify-center relative'>
          <input type="text" className='w-full h-[60%] border placeholder:pl-2 placeholder:text-md pl-3' placeholder= "Search Players,Groups,Games" 
          value={searchval} onChange={(e)=>{const val = e.target.value;
  setsearchval(val);
  setshowdropdown(val.trim().length > 0);
}} />

          {showdropdown && (
            <div className='absolute w-full h-50 overflow-y-auto top-12 bg-slate-900 flex flex-col z-900 border p-2 gap-1' ref={clickOutsideref}>
              {allgames?.filter((game,ind)=>(
                game?.name.toLowerCase().includes(searchval.toLowerCase())
              ))
              .slice(0,10)
              .map((game,ind)=>{
                return (
                  <div className='w-full h-10 border-b flex items-center justify-start gap-5 cursor-pointer pb-1 ' onClick={()=>window.open(game.url,"_blank")}>
                    <div className='w-[80%] gap-3 h-full flex items-center justify-start'>
                    <img src={game.photo} alt="" className='w-20 h-full' />
                       <h1>{game.name}</h1>
                       </div>
                       <div className='flex w-[20%] items-center justify-end gap-1 pr-3'>
                        <Heart className='w-3 h-3 text-pink-400'/>
                        <span className='text-xs'>{game.rating}</span>

                       </div>
                       
                  </div>
                )
              })
              
              
              
              }
              {
                allusers?.filter((user,ind)=>user.name.toLowerCase().includes(searchval.toLowerCase()))
                .slice(0,7).map((user,ind)=>{
                  return (
                    <div className='w-full h-10 border flex items-center justify-center'>
                           
                           <div className='w-1/2 h-full flex items-start justify-center'>
                           <img src={user.image} alt="" className='w-6 h-6 rounded-full object-cover' />
                           <h1>{user?.name}</h1>

                           </div>

                           <div className='w-1/2 h-full flex items-end justify-end'>
                            <Users className='w-5 h-5'/>
                           </div>


                    </div>
                  )
                })
              }



            </div>
          )}
        </div>

        <div className='w-[17%] flex items-center justify-start gap-5'>
          <p className='cursor-pointer hover:animate-pulse ' onClick={()=>navv('/games')}>Dicover</p>
          <p className='cursor-pointer hover:animate-pulse' onClick={()=>navv('/souls')}>Souls</p>
          <p className='cursor-pointer hover:animate-pulse'>Groups</p>
          <p className='cursor-pointer hover:animate-pulse'>Messages</p>

        </div>

        <div className='w-[10%] flex items-center justify-start gap-5 '>
          <Bell className='w-7 h-7 cursor-pointer'/>

          {!userdata?<img src="./image.png" alt="profile" className='w-10 h-10 rounded-full cursor-pointer bg-white' onClick={()=>navv('/login')}/>
          :
          (<div className='w-full flex items-center justify-center gap-4'>
            <img src={userdata?.image} alt="profile" className='w-10 h-10 rounded-full cursor-pointer bg-white' onClick={()=>navv('/profile')}/>
             <LogOut className='w-6 h-6 *: cursor-pointer ' onClick={()=>logout()}/>
</div>)}


        </div>

      
    </div>
  )
}

export default Navbar
