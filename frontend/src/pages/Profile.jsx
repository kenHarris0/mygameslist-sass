import React, { useContext, useEffect, useRef, useState } from 'react'
import profilebanner from '../assets/banner.png'
import { gamecontext } from '../Context/Context'
import Gameshow from '../components/Gameshow'
import axios from 'axios'
import {toast} from 'react-toastify'

const Profile = () => {
const {userdata,url,getuserdata}=useContext(gamecontext)

const [clickedit,setclickedit]=useState(false)
const [userinfo,setuserinfo]=useState({
  name: "",
  bio: "",
  status: "",
})

const [editimage,seteditimage]=useState(false)
//form handliong
const handlechange=(e)=>{
  const {name,value}=e.target

  setuserinfo(prev=>({...prev,[name]:value}))
}
//filehandling

const handlefile=async(e)=>{
  const file=e.target.files[0]
    if(!file) return;
  e.target.value = ""
    const reader=new FileReader()
    reader.readAsDataURL(file)

    reader.onloadend=async()=>{
      const base64=reader.result;
      seteditimage(base64);
  try{
      const res=await axios.post(url+"/user/changePP",{image:base64},{withCredentials:true})
      if(res.data.success){
          getuserdata()
          toast.success("updated Profile pic successfully")
      }
    
  }
  catch(err){
    console.log(err)
  }
}
}

const handlesubmit=async(e)=>{
  e.preventDefault()

  try{
      const res=await axios.post(url+"/user/edit",userinfo,{withCredentials:true})
      if(res.data.success){
          getuserdata()
          toast.success("updated successfully")
      }
    
  }
  catch(err){
    console.log(err)
  }
}

const formref=useRef(null)

useEffect(()=>{

  const clickformaway=(e)=>{
    if(clickedit && formref.current && !formref.current.contains(e.target)){
         setclickedit(false)
    }
  }

  document.addEventListener("mousedown",clickformaway)

  return ()=>document.removeEventListener("mousedown",clickformaway)
},[clickedit])
useEffect(() => {
  if (userdata) {
    setuserinfo({
      name: userdata.name || "",
      bio: userdata.bio || "",
      status: userdata.status || ""
    });
  }
}, [userdata]);

useEffect(()=>{
  getuserdata()
},[])


  return (
    <div className='w-full min-h-screen relative'>
      {clickedit && (
    <div className='fixed inset-0 z-50 bg-black/90 flex items-center justify-center'>

      <form onSubmit={handlesubmit} className='w-140 h-160 border bg-slate-800/30 border-amber-50/10 rounded-2xl shadow-amber-200 flex flex-col items-start justify-start p-6 gap-10' ref={formref}>
      <h1 className='text-4xl font-black'>Edit Profile</h1>

          <input type="text" placeholder='Name' name='name' value={userinfo?.name} onChange={handlechange} className='w-full h-10 p-2 border-4 border-gray-300 rounded-2xl' />
          <textarea type="text" placeholder='Bio' name='bio' rows={4} value={userinfo?.bio} onChange={handlechange} className='w-full h-30 p-2 border-4 border-gray-300 rounded-2xl' />
          <input type="text" placeholder='Status' name='status' value={userinfo?.status} onChange={handlechange}  className='w-full h-10 p-2 border-4 border-gray-300 rounded-2xl'/>

          <button type='submit'  className='w-fit px-3 h-10 py-1 text-xs rounded-full 
      bg-purple-500/20 text-purple-300 font-medium cursor-pointer' >Make changes</button>
             
             
        

      </form>

      </div>
  )}

      {/* Banner */}
      <div className='relative w-full h-100 '>
        <img
          src={profilebanner}
          alt=""
          className='w-full h-full object-cover object-center'
        />

        <div className='absolute inset-0 bg-black/80'></div>
      </div>

      {/* Content BELOW banner */}
      <div className='w-[60%] mx-auto bg-slate-900/80 backdrop-blur-md 
rounded-2xl shadow-xl p-8   border-white/10  border-4 min-h-400'>

  

  <div className='w-full flex gap-6 items-start pb-30'>

    {/* Profile Image */}
    <div className='w-[20%] flex justify-center'>
      <input type="file" onChange={handlefile} id='profilepic' className='hidden' single/>
      <img
        src={editimage?editimage:userdata?.image}
        alt=""
        className='w-32 h-32 rounded-full object-cover 
        border-4 border-slate-800 shadow-md'
        onClick={()=>document.getElementById("profilepic").click()}
      />
    </div>

    {/* Info Section */}
    <div className='w-[80%] flex flex-col gap-3 text-white'>

      {/* Name */}
      <h1 className='text-4xl font-black tracking-wide'>
        {userdata?.name}
      </h1>

      {/* Bio */}
      <p className='text-sm text-gray-300 leading-relaxed font-medium'>
        {userdata?.bio || 
        "-"}
      </p>

      {/* Status */}
      <span className='w-fit px-3 py-1 text-xs rounded-full 
      bg-purple-500/20 text-purple-300 font-medium'>
        {userdata?.status || "Currently grinding "}
      </span>

      {/* edit option */}
      <span className='w-fit px-3 py-1 text-xs rounded-full 
      bg-amber-500/30 text-purple-50 font-medium cursor-pointer' onClick={()=>setclickedit(prev=>!prev)}>
        EDIT 
      </span>

    </div>

  </div>

  {/* library */}
  <h1 className='text-6xl font-black leading-1 pb-20'>Library</h1>
<div className='w-full  grid grid-cols-3  gap-2  pb-4'>
  
  {userdata?.games?.map((game,ind)=>{
    return (
      <Gameshow game={game}/>
    )
  })}

</div>



</div>




    </div>
  )
}

export default Profile
