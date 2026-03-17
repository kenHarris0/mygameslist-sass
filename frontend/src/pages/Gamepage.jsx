import React, { useContext, useEffect, useState } from 'react'
import { Ellipsis,Users,Heart,Link,CircleDollarSign  } from 'lucide-react';
import { gamecontext } from '../Context/Context';
import {useNavigate} from 'react-router-dom'
import { useMemo } from "react";



const Gamepage = () => {

const { allgames, page, setpage, total } = useContext(gamecontext);

const navv=useNavigate()

//filter stuffs

//for rating
const [rating,setrating]=useState(0)
const [ftp,setftp]=useState(false)
const [cost,setcost]=useState(0)
const [genre,setgenre]=useState({
    "Co-op":false,
    "PvP":false,
    "PvE":false,
    "Action RPG":false,
    "MMORPG":false

})


const filteredgames = useMemo(() => {
  if (!allgames) return [];

  return allgames.filter((game) =>{
    const gamerating=parseInt(game.rating)
    const ratingMatch=gamerating>=rating
  
   
    const selectedgenre=Object.keys(genre).filter(g=>genre[g])
     let genrematch=true

     if(selectedgenre.length>0){
        genrematch=selectedgenre.some(g=>
            game.genres?.includes(g)
        )
     }
     if(ftp){
        return ratingMatch && game.price==="Free/F2P" && genrematch
     }
     if(cost>0){
        const gamecost=parseInt(game.price.replace("$","")) || 0
       const isfree=game.price==="Free/F2P"

         return ratingMatch && !isfree&&  gamecost<=cost && genrematch
        
        
     }

    return ratingMatch && genrematch

  })
}, [allgames, rating,ftp,cost,genre]); 







console.log(allgames);
console.log(filteredgames);





  return (
  <div className='w-full min-h-screen bg-slate-900 flex flex-col pt-20'>

  {/* HEADER */}
  <div className='w-full flex items-end justify-center p-6'>
    <h1 className='text-5xl font-bold text-white'>
      Find Games You Want to Play
    </h1>
    <Ellipsis className='animate-pulse text-white'/>
  </div>

  {/* MAIN LAYOUT */}
  <div className='flex flex-1 gap-10 px-4'>

    {/* SIDEBAR */}
    <div className='w-[20%] h-fit sticky flex flex-col gap-4 top-24 bg-slate-800 p-4 rounded-xl border'>
      Filters

    <div className="flex flex-col gap-2 text-white font-bold pt-5">

  <label className="text-sm">
    Minimum Rating: {rating}%
  </label>

  <input
    type="range"
    min="0"
    max="100"
    value={rating}
   onChange={(e) => setrating(Number(e.target.value))}
    className="w-full cursor-pointer"
  />

</div>

    <div className="flex    text-white font-bold pt-5  p-1">


<label className=' flex gap-5'>
  <input
    type="checkbox"
    checked={ftp}
    onChange={()=>setftp(prev=>!prev)}
    className=" cursor-pointer"
    disabled={cost}

  />
  Free
</label>

</div>

<div className="flex flex-col gap-2 text-white font-bold pt-5">

  <label className="text-sm">
    Max Cost: {cost}$
  </label>

  <input
    type="range"
    min="0"
    max="100"
    value={cost}
   onChange={(e) => setcost(Number(e.target.value))}
    className="w-full cursor-pointer"
    disabled={ftp}
  />

</div>
{/*for genres"*/}
  <div className="flex flex-col   text-white font-bold pt-5  p-1">


{Object.keys(genre).map((g,i)=>{
    return(
 <label className=' flex gap-5'>
  <input
    type="checkbox"
    checked={genre[g]}
onChange={() =>
  setgenre(prev => ({ ...prev, [g]: !prev[g] }))
}
    className=" cursor-pointer"
    

  />
  {g}
</label>
    )
})
   
}

</div>




    </div>

    {/* RIGHT SCROLLABLE AREA */}
    <div className='w-[80%] max-h-[calc(100vh-120px)] overflow-y-auto pr-2'>
        <p className='text-sm p-5'>Showing {filteredgames?.length} results</p>

      <div className='grid grid-cols-3 gap-6'>
        
        {filteredgames?.map((game) => (
          <div
            key={game._id}
            className='group bg-slate-900 rounded-2xl overflow-hidden 
            shadow-lg hover:shadow-purple-500/20 
            hover:-translate-y-2 transition duration-300'
          >

            {/* IMAGE */}
            <div className='w-full h-48 overflow-hidden relative'>
              <img
                src={game.photo}
                className='w-full h-full object-cover group-hover:scale-110 transition duration-500'
              />
              <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition'></div>
            </div>

            {/* CONTENT */}
            <div className='p-4 flex flex-col gap-3 text-white'>

              <h1 className='font-bold text-lg truncate'>
                {game.name}
              </h1>

              <p className='text-sm text-gray-400 truncate'>
                {game.publisher}
              </p>

              <div className='flex items-center justify-between text-sm text-gray-300'>
                <div className='flex items-center gap-1'>
                  <Users className='w-4 h-4 text-blue-400'/>
                  <span>{game.playerCount}</span>
                </div>

                <div className='flex items-center gap-1'>
                  <Heart className='w-4 h-4 text-pink-400'/>
                  <span>{game.rating}</span>
                </div>

                <div className='flex items-center gap-1'>
                  <CircleDollarSign className='w-4 h-4 text-green-400'/>
                  <span>{game.price}</span>
                </div>
              </div>

              <div className='flex justify-between items-center mt-2'>
                <button
                  onClick={() => window.open(game.url, "_blank")}
                  className='px-3 py-1 text-sm rounded-lg 
                  bg-linear-to-r from-pink-500 to-purple-500 
                  hover:scale-105 transition'
                >
                  View Game
                </button>

                <Link
                  className='w-5 h-5 cursor-pointer text-gray-400 hover:text-blue-400 transition'
                  onClick={() => window.open(game.url, "_blank")}
                />
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  </div>
</div>
  )
}

export default Gamepage
