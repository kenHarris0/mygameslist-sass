import React, { useContext, useEffect } from 'react'
import { gamecontext } from '../Context/Context'
import axios from 'axios'
import Gameshow from './Gameshow'



const Library = () => {
const {getuserdata}=useContext(gamecontext)
    useEffect(()=>{
   getuserdata()
    },[])

  const { userdata } = useContext(gamecontext)

  return (
    <div className='w-full  grid grid-cols-4  gap-5 p-4'>
      {userdata?.games?.map((game, ind) => {
        return (
          <Gameshow game={game}/>
        )
      })}
    </div>
  )
}

export default Library
