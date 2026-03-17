import React from 'react'
import Navbar from './components/Navbar'
import {Route, Routes} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import Home  from './pages/Home.jsx'
import Login from './pages/Login'
import Gamepage from './pages/Gamepage.jsx'
import Profile from './pages/Profile.jsx'

const App = () => {
  return (
    <div  className='w-screen h-screen flex flex-col items-center'>
      <ToastContainer/>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
         <Route path='/games' element={<Gamepage/>} />
         <Route path='/profile' element={<Profile/>} />
      </Routes>
      
    </div>
  )
}

export default App
