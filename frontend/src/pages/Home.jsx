import React from 'react'
import Hero from '../components/Hero'
import Library from '../components/Library'
import Socialhub from '../components/Socialhub'

const Home = () => {
  return (
    <div className='w-screen h-screen flex'>
{/*left part to show social hub*/}
      <div className='w-[20%] h-full flex flex-col border-r border-white/20 pt-30'>
      <Socialhub/>

      </div>



{/*right part to show landing page*/}
<div className='w-[80%] h-full overflow-y-auto flex flex-col p-10 gap-15'>
        {/** hero section**/}
<div className='w-full h-100 mt-10 rounded-4xl  '>
  <Hero/>
  


</div>
<div className='w-full h-100'>
  <Library/>
</div>

</div>

    
      
    </div>
  )
}

export default Home
