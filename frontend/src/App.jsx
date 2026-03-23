import React from 'react'
import Navbar from './components/Navbar'
import {Route, Routes} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import Home  from './pages/Home.jsx'
import Login from './pages/Login'
import Gamepage from './pages/Gamepage.jsx'
import Profile from './pages/Profile.jsx'
import Gamedesc from './pages/Gamedesc.jsx'
import Souls from './pages/Souls.jsx'
const App = () => {
  return (
    <div  className='w-screen min-h-screen flex flex-col items-center'>
      <ToastContainer/>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
         <Route path='/games' element={<Gamepage/>} />
         <Route path='/profile' element={<Profile/>} />
         <Route path='/game/:id' element={<Gamedesc/>} />
         <Route path='/souls' element={<Souls/>} />
      </Routes>
      
    </div>
  )
}

export default App
