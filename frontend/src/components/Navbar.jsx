import React from 'react'
import { Gamepad2 } from 'lucide-react';
const Navbar = () => {
  return (
    <div className='w-full h-17.5 bg-blue-950   flex items-center justify-start p-1 pl-4'>

        <div className='w-[15%] h-[80%] flex items-center justify-start border '>
               <Gamepad2 className='w-10 h-10' />
               <h1 className='text-3xl text-center pl-4'>mygameslist</h1>


        </div>

      
    </div>
  )
}

export default Navbar
