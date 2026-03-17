import React from 'react'
import Hero from '../components/Hero'

const Home = () => {
  return (
    <div className='w-screen min-h-screen flex  items-center overflow-auto  '>
{/*left part to show social hub*/}
      <div className='w-[20%] h-full flex flex-col border-r border-white/20'>

      </div>



{/*right part to show landing page*/}
<div className='w-[80%] h-full flex flex-col items-center justify-start mt-17 p-10 '>
        {/** hero section**/}
<div className='w-full h-100 mt-10 rounded-4xl'>
  <Hero/>
</div>

</div>

    
      
    </div>
  )
}

export default Home
