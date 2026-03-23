import React, { useEffect } from 'react'
import Herobanner from '../assets/hero.png'
import terrain from '../assets/banner.png'
import {useNavigate} from 'react-router-dom'
import gsap from "gsap";
const Hero = () => {

  const navv = useNavigate();

  return (
    <div
      className="w-full h-[420px] bg-cover bg-center relative flex items-center justify-between px-12 rounded-3xl overflow-hidden"
      style={{ backgroundImage: `url(${Herobanner})` }}
    >

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>

      {/* Glow effect */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-500/20 blur-3xl rounded-full"></div>

      {/* LEFT CONTENT */}
      <div className="relative z-10 max-w-xl flex flex-col gap-4 text-white">

        <h1 className="text-5xl font-extrabold leading-tight">
          Welcome to{" "}
          <span className="text-purple-300 drop-shadow-[0_0_15px_rgba(217,70,239,0.8)]">
            MyGamesList
          </span>
        </h1>

        <p className="text-gray-300 text-lg">
          Find players, explore games, and build your squad.
        </p>

        <div className="flex gap-4 mt-4">

          {/* Primary button */}
          <button
            onClick={() => navv('/games')}
            className="px-6 py-2 rounded-full bg-linear-to-r from-pink-500 to-purple-500 
            hover:scale-105 transition font-semibold shadow-lg"
          >
            Discover Games
          </button>

          {/* Secondary button */}
          

        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="relative z-10">
        <img
          src={terrain}
          alt=""
          className="w-80 h-80 object-cover rounded-2xl shadow-2xl 
          hover:scale-105 transition duration-500"
        />

        {/* glow under image */}
        <div className="absolute inset-0 bg-purple-500/10 blur-2xl -z-10 rounded-full"></div>
      </div>

    </div>
  )
}

export default Hero
