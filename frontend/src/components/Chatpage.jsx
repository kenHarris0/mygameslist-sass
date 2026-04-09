import React, { useEffect, useRef, useState } from 'react'
import { useContext } from 'react'
import {gamecontext} from '../Context/Context'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Paperclip,SendHorizontal  } from 'lucide-react';


const Chatpage = ({uid,uname}) => {
    const {url,socket,userdata,allusers,Privatemessages,setPrivatemessages,getPrivateMessages,onlineusers}=useContext(gamecontext)



const { pid, pname } = useParams();

const id = uid || pid;
const name = uname || pname;



const [receiverinfo,setreceiverinfo]=useState({
    id:"",
    name:"",
    image:""
})
const gotoendRef=useRef(null)

useEffect(()=>{
   if(!id || !allusers) return;

   const curruser = allusers.find(user => user._id?.toString() === id);

   if(curruser){
    setreceiverinfo({
        id,
        name:curruser.name,
        image: curruser.image
    })
   }

}, [id, allusers]); 

useEffect(()=>{
  if(!id) return;
  getPrivateMessages(id);
}, [id]);

const formatTime = (time) => {
  return new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};




useEffect(()=>{
  if(!socket)return;

  const handler=(data)=>{
    if(data.senderId!==userdata._id){
    setPrivatemessages(prev=>[
      ...prev,data

    ])
  }

    
  }

  socket.on('newmessage',handler)

  return ()=>socket.off('newmessage',handler)

},[socket])

const [msgtext,setmsgtext]=useState("")


const isOppsOnline=onlineusers?.includes(id)

const sendMessage=async()=>{
      if (!msgtext.trim() && !filee) return;
        const tempMsg = {
    _id: Date.now(), // unique temp id
    senderId: userdata._id,
    receiverId: id,
    text: msgtext,
    image: filee,
    createdAt: new Date(),
  };


  setPrivatemessages(prev => [...prev, tempMsg]);

  
  setmsgtext("");
  setfilee(null);
  try{

     const res=await axios.post(url+'/msg/send',{receiverId:id,text:tempMsg.text,image:tempMsg.image},{withCredentials:true})
      if(res.data.success){
       
        setPrivatemessages(prev=>[...prev.filter(msg=>msg._id!==tempMsg._id),res.data.payload])
        
        
      }
   

  }
  catch(err){
    console.log(err)
  }
}
console.log(onlineusers);

useEffect(()=>{
   gotoendRef?.current?.scrollIntoView({behavior:"smooth"})
},[Privatemessages])


const [filee,setfilee]=useState(null)
const fileref=useRef(null)

const handlefile=(e)=>{
  const file=e.target.files[0]
  if(!file) return
  e.target.value=null
  const reader=new FileReader()
  reader.readAsDataURL(file)

  reader.onloadend=async()=>{
  const base64=reader.result
  setfilee(base64)
  }
}

useEffect(()=>{

},[socket])


  return (
    <div className='w-full h-full flex flex-col'>

        {/*header*/}
        <div className='w-full h-[8%] p-7 flex items-center justify-start border-b  gap-2'>
            <img src={receiverinfo?.image || ""} alt="" className='w-10 h-10 rounded-full object-fit'/>
            <div className='flex flex-col items-start justify-center  h-15'>
              <h1 className='text-2xl font-bold '>{receiverinfo?.name || ""}</h1>
<p className='text-xs text-gray-50 animate-pulse '>{isOppsOnline?"Online":"Offline"}</p>
            </div>
            
            

        </div>

        <div className='w-full h-[90%] flex flex-col overflow-y-auto p-3'>

            {Privatemessages?.map((message,ind)=>{

               const isSender =
  message?.senderId?._id
    ? message.senderId._id.toString() === userdata?._id?.toString()
    : message?.senderId?.toString() === userdata?._id?.toString();

                return(
               <div key={message._id} className={`chat ${isSender ? "chat-end" : "chat-start"}`}>

      {/* Avatar */}
      <div className="chat-image avatar">
        <div className={`w-10 rounded-full avatar `}>
          <img
            src={isSender ? userdata?.image : receiverinfo?.image}
          />
        </div>
      </div>

      {/* Bubble */}
      <div className="chat-bubble font-extrabold text-sm">
        {message?.text}
        {message?.image && <img src={message?.image} alt="" className='w-45 h-30 object-cover pt-2' />}
        <div className="text-[10px] opacity-50 mt-1 text-right">
      {formatTime(message.createdAt)}
    </div>
         
      </div>
      
      
     

    </div>
                )
            })}
            <div ref={gotoendRef}>

            </div>
            

        </div>


        <div className='w-full h-[10%] flex items-center justify-center  p-4 gap-5 relative'>
            <input type="text" placeholder='Message' className='w-[90%] border h-10 p-4 rounded-4xl' value={msgtext} onChange={(e)=>setmsgtext(e.target.value)}  onKeyDown={(e) => {
    if (e.key === "Enter" && (msgtext.trim() || filee)) {
      sendMessage();
    }
  }}/>
  
  <Paperclip className='w-7 h-7 cursor-pointer hover:text-yellow-600 ' onClick={()=>fileref?.current?.click()} />
    <input type="file" onChange={handlefile} ref={fileref} className='hidden '/>
            
            <SendHorizontal className='w-7 h-7 cursor-pointer hover:text-yellow-600 ' onClick={()=>sendMessage()} />

              {filee && (<div className='absolute -top-33 left-10 border w-50 h-35 bg-black/30'>
                <img src={filee} alt="" className='w-full h-full object-cover  relative'/>
                <p className='absolute -top-2 text-sm cursor-pointer -right-2 border rounded-full bg-red-500 w-5 h-5 text-center' onClick={()=>setfilee(null)}>X</p>


              </div>)}

        </div>
      
    </div>
  )
}

export default Chatpage
