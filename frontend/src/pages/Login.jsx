import React, { useContext, useState,useRef,useEffect } from 'react'
import { gamecontext } from '../Context/Context'
import axios from 'axios'
import * as THREE from "three";
import HALO from "vanta/dist/vanta.halo.min";
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { Ellipsis } from 'lucide-react';

const Login = () => {
//vanta setup 
 const vantaRef = useRef(null);
  const effectRef = useRef(null);
const navv=useNavigate()
const [loading,setloading]=useState(false)
  useEffect(() => {
    if (!effectRef.current) {
      effectRef.current = HALO({
        el: vantaRef.current,
        THREE: THREE,
       mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  baseColor: 0x253f77,
  backgroundColor: 0x10152f,
  xOffset: -0.20,
  yOffset: 0.05,
  size: 0.50
      });
    }

   
  }, []);

const {url,userdata,getuserdata,setuserdata}=useContext(gamecontext);

const [useripdata,setuseripdata]=useState({
  name:"",
  email:"",
  password:""
})
const [type,settype]=useState("register")

const login=async()=>{
  try{
    const res=await axios.post(url+"/user/login",{email:useripdata.email,password:useripdata.password},{withCredentials:true});
    if(res.data.success){
      setuserdata(res.data.success)
      toast.success("logged in successfully ")
setloading(true)
      setTimeout(() => {
        
        navv('/')

        
      }, 1000);
    }

  }
  catch(err){
    console.log(err)
  }
}
const register=async()=>{
  try{
    const res=await axios.post(url+"/user/register",useripdata,{withCredentials:true});
    if(res.data.success){
      setuserdata(res.data.payload)
      toast.success("signed in successfully ")
      setloading(true)
      setTimeout(() => {
        
        navv('/')

        
      }, 1000);
    }

  }
  catch(err){
    console.log(err)
  }
}

const handlechange=(e)=>{
  const {name,value}=e.target
  setuseripdata(prev=>({...prev,[name]:value}))
}

const handlesubmit=(e)=>{
  e.preventDefault()
  try{
    if(type==="register"){
      register()
    }
    else{
      login()
    }

  }
  catch(err){
    console.log(err)
  }
}




  return (
    <div ref={vantaRef} className="w-screen h-screen relative overflow-hidden">

      {loading && (
  <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center">
    
    <div className="flex items-center gap-3 text-white text-xl font-semibold">
      <span className="animate-pulse">Redirecting, please wait</span>
      <Ellipsis className="w-7 h-7 animate-bounce" />
    </div>

  </div>
)}

  {/* Glass Card */}
  <div className="absolute inset-0 flex items-center justify-center ">
    
    <form className="w-95 p-8 rounded-2xl 
      bg-white/10 backdrop-blur-xl 
      border border-white/20 
      shadow-4xl text-white"
      onSubmit={handlesubmit}
    >
      <h1 className="text-2xl font-semibold mb-10 text-center">
        MyGamesList {type==="register"?"Signup":"Login"}
      </h1>

      
{type==="register" && <input
        type="text"
        placeholder="name"
        name='name'
        value={useripdata.name}
        className="w-full mb-3 p-2 rounded bg-white/10 border border-white/20 placeholder:text-gray-300"
        onChange={handlechange}
      /> }
      <input
        type="text"
        placeholder="Email"
        name='email'
        value={useripdata.email}
        className="w-full mb-3 p-2 rounded bg-white/10 border border-white/20 placeholder:text-gray-300"
        onChange={handlechange}
      />

      <input
        type="password"
        name='password'
        placeholder="Password"
        value={useripdata.password}
        className="w-full mb-4 p-2 rounded bg-white/10 border border-white/20 placeholder:text-gray-300"
        onChange={handlechange}
      />


      {type==="register"?<p className='text-xs cursor-pointer pt-2 pb-3' onClick={()=>settype("login")}>Already have an account? Login here</p>:<p className='text-xs cursor-pointer pt-2 pb-3' onClick={()=>settype("register")}>New to MyGamesList? please sign up here</p>}

      <button type='submit' className="w-full py-2 rounded bg-blue-500 hover:bg-blue-400 transition cursor-pointer">
        {type==="register"?"Signup":"Login"}
      </button>
    </form>

  </div>
</div>
  )
}

export default Login
