import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { gamecontext } from '../Context/Context';


const Gameshow = ({ game }) => {

  const navv=useNavigate();
  const {getuserdata,userdata,onlineusers}=useContext(gamecontext)

const gamedata=userdata?.games?.find((g)=>g.game._id.toString()===game.game._id.toString())
  
useEffect(()=>{
  getuserdata()
},[])
  return (
    <div className='w-80 h-80 shrink-0 bg-slate-800 rounded-2xl 
    flex flex-col overflow-hidden shadow-md hover:shadow-purple-500/20 
    transition duration-300 hover:-translate-y-2 group' onClick={()=>navv(`/game/${game.game._id}`)}>

      {/* IMAGE */}
      <div className='w-full h-40 overflow-hidden relative'>
        <img
          src={game.game.photo}
          alt=""
          className='w-full h-full object-cover 
          group-hover:scale-110 transition duration-500'
        />

        {/* overlay on hover */}
        <div className='absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition'></div>
      </div>

      {/* CONTENT */}
      <div className='flex flex-col p-4 gap-2 text-white'>

        {/* title */}
        <h1 className='text-lg font-semibold truncate'>
          {game.game.name}
        </h1>

        {/* publisher */}
        <p className='text-xs text-gray-400 truncate'>
          {game.game.publisher}
        </p>

        {/* time played */}
        <p className='text-sm font-medium'>
            <p className='text-semibold'>{game.totalTimePlayed} min</p>
          <input type='range' min={0} max={600000} value={game.totalTimePlayed} disabled={true} />
        </p>

        {/* status badge */}
        <span
          className={`w-fit px-2 py-1 text-xs rounded-full font-medium
          ${
            game.status === "Completed"
              ? "bg-green-500/20 text-green-400"
              : game.status==="Playing"?"bg-purple-500/20 text-white":
              game.status==="Away"?"bg-yellow-400/30 text-white":""
          }`}
        >
          {game.status}
        </span>

      </div>
    </div>
  );
};

export default Gameshow
