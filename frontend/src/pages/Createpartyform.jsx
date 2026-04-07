import React, { useContext, useState } from 'react'
import { gamecontext } from '../Context/Context'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
const Createpartyform = () => {
    const {url,userdata}=useContext(gamecontext)

    const {gamename,id}=useParams()
    const navv=useNavigate()

const createParty=async()=>{
 
 
  try{
    const res=await axios.post(url+'/party/add',{name:name,members:[...members,userdata?._id],game:gamename,limit:limit,Open:ptype},{withCredentials:true})
    if(res.data.success){
      toast.success(`new party created in ${gamename}`)
      setTimeout(() => {
        navv(`/game/${id}`)
        
      }, 1000);
    }

  }
  catch(err){
    console.log(err)
  }
}

const [name,setname]=useState("")
const [members,setmembers]=useState([])
const [limit,setlimit]=useState(4)
const [ptype,setptype]=useState("public")


const addmemberstoparty=(id)=>{

    if(members?.length <limit-1){
      setmembers(prev=>{
          if(prev.includes(id)) return prev;

          return [...prev,id]
      
      })
    }

}

const removemember = (id) => {
    setmembers(prev => prev.filter(idd => idd !== id));
};

const [searchfilter,setsearchfilter]=useState("")

  return (
  <div className='w-screen min-h-screen flex items-center justify-center pt-20 bg-slate-950 text-white'>

  <form
    className='w-125 max-h-[90vh] overflow-y-auto border border-white/10 bg-slate-900/80 backdrop-blur-lg rounded-3xl p-6 flex flex-col gap-5 shadow-2xl'
    onSubmit={(e) => {
      e.preventDefault();
      createParty();
    }}
  >

    {/* Title */}
    <h1 className='text-3xl font-extrabold text-center text-purple-400'>
      Create Party
    </h1>

    {/* Party Name */}
    <div className='flex flex-col gap-2'>
      <label className='text-sm text-slate-400'>Party Name</label>
      <input
        type="text"
        placeholder='Enter party name'
        value={name}
        className='p-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500'
        onChange={(e) => setname(e.target.value)}
      />
    </div>

    {/* Search */}
    <div className='flex flex-col gap-2'>
      <label className='text-sm text-slate-400'>Add Friends</label>
      <input
        type="text"
        value={searchfilter}
        placeholder='Search friends...'
        className='p-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500'
        onChange={(e) => setsearchfilter(e.target.value)}
      />
    </div>

    {/* Friends List */}
    <div className='h-40 overflow-y-auto border border-white/10 rounded-xl p-2 flex flex-col gap-2 bg-slate-800/40'>
      {userdata?.friends
        ?.filter(friend =>
          friend?.name.toLowerCase().includes(searchfilter.toLowerCase())
        )
        .map((friend, ind) => {

          const alreadyinparty = members?.includes(friend._id);

          return (
            <div
              key={ind}
              className='flex items-center justify-between p-2 rounded-lg bg-slate-700/60 hover:bg-slate-700 transition'
            >
              <h1 className='text-sm font-semibold text-slate-200'>
                {friend?.name}
              </h1>

              {!alreadyinparty ? (
                <button
                  type='button'
                  className='px-3 py-1 bg-green-600/80 rounded-lg text-xs font-bold hover:bg-green-500 transition'
                  onClick={() => addmemberstoparty(friend?._id)}
                >
                  Add
                </button>
              ) : (
                <button
                  type='button'
                  className='px-3 py-1 bg-red-600/80 rounded-lg text-xs font-bold hover:bg-red-500 transition'
                  onClick={() => removemember(friend?._id)}
                >
                  Remove
                </button>
              )}
            </div>
          );
        })}
    </div>

    {/* Party Size */}
    <div className='flex flex-col gap-2'>
      <label className='text-sm text-slate-400'>Party Size</label>
      <input
        type="number"
        max={10}
        value={limit}
        className='p-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500'
        onChange={(e) => setlimit(Number(e.target.value))}
      />
    </div>

    {/* Party Type */}
    <div className='flex flex-col gap-2'>
      <label className='text-sm text-slate-400'>Party Type</label>

      <div className='flex gap-4'>
        <label className='flex items-center gap-2 cursor-pointer'>
          <input
            type="radio"
            name="partyType"
            value="private"
            checked={ptype === "private"}
            onChange={(e) => setptype(e.target.value)}
          />
          <span className='text-sm'>Private 🔒</span>
        </label>

        <label className='flex items-center gap-2 cursor-pointer'>
          <input
            type="radio"
            name="partyType"
            value="public"
            checked={ptype === "public"}
            onChange={(e) => setptype(e.target.value)}
          />
          <span className='text-sm'>Public 🌍</span>
        </label>
      </div>
    </div>

    {/* Submit */}
    <button
      type="submit"
      className='mt-2 w-full py-3 rounded-xl bg-linear-to-r from-pink-500 to-purple-500 font-bold text-white shadow-lg hover:scale-[1.03] transition'
    >
      Create Party 
    </button>

  </form>
</div>
  )
}

export default Createpartyform
