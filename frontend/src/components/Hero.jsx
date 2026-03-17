import React, { useEffect } from 'react'
import Herobanner from '../assets/hero.png'
import terrain from '../assets/banner.png'
import {useNavigate} from 'react-router-dom'
import gsap from "gsap";
const Hero = () => {

const navv=useNavigate()

 

  return (
   <div
  className="w-full h-full bg-cover bg-center flex relative items-center justify-between px-10 rounded-4xl "
  style={{ backgroundImage: `url(${Herobanner})`  }}
>
    <div className='absolute inset-0 bg-blue-950/90 rounded-4xl'></div>
  {/* Left */}
 <div className="text-white z-10 max-w-xl flex flex-col items-start justify-start p-10">
  
  <h1 className="text-6xl font-bold  mb-10">
    Welcome to <span className="text-purple-200  " style={{
    textShadow:
      " 0 0 10px #d946ef",
  }}>MyGamesList</span>
  </h1>

  <h2 className="text-lg font-semibold text-gray-200 w-100 mb-2">
    Find Players To Play With Online
  </h2>

  <p className="text-lg font-semibold text-gray-200 w-100 mb-5">
    Discover games, connect with players, and build your squad.
  </p>

  <button className='w-40  h-10   cursor-pointer hover:bg-purple-500 hover:text-white font-bold rounded-full bg-pink-200 text-black ' onClick={()=>navv('/games')}>Discover Games</button>

</div>

  {/* Right */}
  <div className='z-10'>
    <img
      src={terrain}
      alt=""
      className="w-80 h-80 object-cover rounded-2xl "
    />
  </div>
</div>
  )
}

export default Hero
