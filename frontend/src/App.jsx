import React, {lazy,Suspense,useContext,useEffect} from 'react'
import Navbar from './components/Navbar'
import {Route, Routes} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import Loader from './components/Loader.jsx';
import ErrorBoundary from './components/Errorboundary.jsx';
import Createpartyform from './pages/Createpartyform.jsx';
import Partychat from './pages/Partychat.jsx';
import { gamecontext } from './Context/Context.jsx';
const Crashpage =lazy(()=>import('./components/Crashpage.jsx'));
import axios from 'axios';
const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login"));
const Gamepage = lazy(() => import("./pages/Gamepage.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Gamedesc = lazy(() => import("./pages/Gamedesc.jsx"));
const Souls = lazy(() => import("./pages/Souls.jsx"));
const Privatechat = lazy(() => import("./pages/Privatechat.jsx"));
import { useDispatch } from 'react-redux';
import {getallparties,deleteparty,updatePartyNewJoin,newpartycreated} from './Redux/Slices/PartySlice.js'
import { toast } from 'react-toastify';

const App = () => {

  const {url,userdata,socket}=useContext(gamecontext)
const dispatch=useDispatch()
  useEffect(()=>{
  if(!userdata?._id) return;

  const fetcher = async () => {
    try {
      const res = await axios.get(url + '/party/getallparty', { withCredentials: true });

      if (res.data.success) {
        dispatch(getallparties(res.data.payload));
      }
    } catch (err) {
      console.log(err);
    }
  };

  fetcher();
}, [userdata?._id]); 

// events for party handling

useEffect(() => {
  if (!socket) return;

  const handleJoin = (data) => {
    const { user, party } = data;
    toast.success(`${user?.name} joined the party`);
    dispatch(updatePartyNewJoin(party));
  };

  const handleLeave = (data) => {
    const { user, party } = data;
    toast.info(`${user?.name} left the party`);
    dispatch(updatePartyNewJoin(party));
  };

  const handleUpdate = (data) => {
    dispatch(updatePartyNewJoin(data));
  };

  const handleCreate = (data) => {
    dispatch(newpartycreated(data));
  };
  
  const handlePartyDelete=(data)=>{
    dispatch(deleteparty(data))
  }

  const sendNotiforpartyDelete=(data)=>{
    toast.info(`the Party ${data?.name} has been deleted by admin`)
  }

  socket.on('newpartyjoin', handleJoin);
  socket.on('leftpartyupdate', handleLeave);
  socket.on('partyUpdated', handleUpdate);
  socket.on('newpartycreated', handleCreate);
  socket.on('partyDeleted',handlePartyDelete)
  socket.on('partydeletednotification',sendNotiforpartyDelete)

  return () => {
    socket.off('newpartyjoin', handleJoin);
    socket.off('leftpartyupdate', handleLeave);
    socket.off('partyUpdated', handleUpdate);
    socket.off('newpartycreated', handleCreate);
    socket.off('partyDeleted',handlePartyDelete);
    socket.off('partydeletednotification',sendNotiforpartyDelete)
  };
}, [socket]);

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
         <Route path='/createparty/:gamename/:id' element={<Createpartyform/>}/>
         <Route path='/partychat/:id' element={<Partychat/>}/>
      </Routes>
      
      </Suspense>
      </ErrorBoundary>
      
    </div>
  )
}

export default App
