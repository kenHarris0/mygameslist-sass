import axios from 'axios'
import React, { useContext, useEffect, useRef ,useState} from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {useParams} from 'react-router-dom'
import { gamecontext } from '../Context/Context'
import {getallpartymessages,updatepartymessage} from '../Redux/Slices/PartymsgSlice'
import { Paperclip,SendHorizontal  } from 'lucide-react'
const Partychat = () => {
    const {id}=useParams()
const {url,socket,userdata}=useContext(gamecontext)
    const messages=useSelector(state=>state.partymessage.partymessages)
const allparty=useSelector(state=>state.party.parties)
console.log(messages)
//ind the curr parth details


const currparty = allparty?.find(
  prty => prty?._id.toString() === id.toString()
);




const dispatch=useDispatch()

const sendMessage=async()=>{
     const res=await axios.post(url+'/partymsg/send',{groupId:id,text:msgtext,image:filee},{withCredentials:true})
        if(res.data.success){
            dispatch(updatepartymessage(res.data.payload))
            setfilee(null)
            setmsgtext("")

        }
}


    useEffect(()=>{

        const handler=async()=>{
        const res=await axios.post(url+'/partymsg/get',{groupId:id},{withCredentials:true})
        if(res.data.success){
            dispatch(getallpartymessages(res.data.payload))
        }
        }
        handler()
    },[id])

    useEffect(()=>{
        if(!socket) return;

        const handler=(data)=>{
            dispatch(updatepartymessage(data))
        }

        socket.on('new-party-message',handler)

        return ()=>socket.off('new-party-message',handler)

    },[socket])

console.log(messages)
const formatTime = (time) => {
  return new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};


//file handling
const gotoendRef=useRef(null)
const [filee,setfilee]=useState(null)
const [msgtext,setmsgtext]=useState("")
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

//gotoend of chat on load
useEffect(()=>{
   gotoendRef?.current?.scrollIntoView({behavior:"smooth"})
},[messages])

const min=(a,b)=>{
    if(a<=b){
        return a;
    }
    return b;
}


  return (
    <div className='w-screen h-screen pt-10 flex items-center justify-center '>
         <div className='w-[80%] h-[85%] border p-3'>
    <div className='w-full h-full flex flex-col'>

        {/*header*/}
        <div className='w-full h-[8%] p-7 flex items-center justify-start border-b  gap-2'>
            
            <div className='flex gap-4 items-center justify-between w-full  h-15'>
              <h1 className='text-2xl font-bold text-gray-200/80 '>{currparty?.name || ""}</h1>
              <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {currparty?.members?.slice(0, min(currparty?.members?.length,5)).map((member, index) => (
                <div
                  key={index}
                  className="w-7 h-7 rounded-full border border-gray-900 overflow-hidden"
                >
                  <img
                    src={member?.image}
                    alt="member"
                    className="w-full h-full object-cover "
                    title={member?.name}
                  />
                </div>
              ))}
            </div>

            <span className="text-[11px] text-gray-400">
              {currparty?.members?.length} Members
            </span>
          </div>

            </div>
            
            

        </div>

        <div className='w-full h-[90%] flex flex-col overflow-y-auto p-3'>

            {messages?.map((message,ind)=>{

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
            src={isSender ? userdata?.image : message?.senderId?.image}
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
    </div>
    </div>
  )
}

export default Partychat
