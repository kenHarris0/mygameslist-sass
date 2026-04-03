import React, {lazy,Suspense} from 'react'
import Navbar from './components/Navbar'
import {Route, Routes} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import Loader from './components/Loader.jsx';
import ErrorBoundary from './components/Errorboundary.jsx';
const Crashpage =lazy(()=>import('./components/Crashpage.jsx'));

const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login"));
const Gamepage = lazy(() => import("./pages/Gamepage.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Gamedesc = lazy(() => import("./pages/Gamedesc.jsx"));
const Souls = lazy(() => import("./pages/Souls.jsx"));
const Privatechat = lazy(() => import("./pages/Privatechat.jsx"));




const App = () => {
  return (
    <div  className='w-screen min-h-screen flex flex-col items-center'>
      <ToastContainer/>
      <Navbar/>
       <ErrorBoundary>
      <Suspense fallback={<Loader/>}>
     
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='*' element={<Crashpage/>} />
        <Route path='/login' element={<Login/>} />
         <Route path='/games' element={<Gamepage/>} />
         <Route path='/profile' element={<Profile/>} />
         <Route path='/game/:id' element={<Gamedesc/>} />
         <Route path='/souls' element={<Souls/>} />
         <Route path='/privatechat/:id/:name' element={<Privatechat/>}/>
      </Routes>
      
      </Suspense>
      </ErrorBoundary>
      
    </div>
  )
}

export default App
