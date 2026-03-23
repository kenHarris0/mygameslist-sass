import React, { useContext, useEffect } from 'react'
import { gamecontext } from '../Context/Context'
import { UserPlus } from 'lucide-react';
const Souls = () => {
    const {allusers,userdata,getuserdata,socket,getallusers,setallusers}=useContext(gamecontext)


useEffect(() => {
  getallusers();
}, []);

useEffect(() => {
  if (!socket) return;

  const handler = ({ _id, gameId, currentlyPlaying, status, prevPlayed, prevPlayingTime }) => {
    setallusers(prev =>
      prev.map(user => {
        if (user._id.toString() !== _id.toString()) return user;

        return {
          ...user,
          currentlyPlaying: currentlyPlaying ?? user.currentlyPlaying,
          prevPlayed: prevPlayed ?? user.prevPlayed,
          prevPlayingTime: prevPlayingTime ?? user.prevPlayingTime,
          games: user.games.map(g =>
            g.game?._id?.toString() === gameId?.toString()
              ? { ...g, status: status ?? g.status }
              : g
          )
        };
      })
    );
  };

  socket.on("userCurrentPlaying", handler);
  return () => socket.off("userCurrentPlaying", handler);
}, [socket, setallusers]);  


console.log("allusers in souls", allusers);

  return (
   <div className='w-[80%] mx-auto min-h-screen flex flex-col items-start justify-start pt-20'>
  <p className='font-black text-gray-300 leading-relaxed mb-4 tracking-widest'>
    COMMUNITY HUB
  </p>

  <h1 className='text-7xl font-extrabold mb-7'>
    FIND YOUR <span className='text-purple-500'>SQUAD</span>
  </h1>

  <div className='w-2/3 flex flex-col items-start gap-5 mb-8'>
    <input
      type="text"
      placeholder='Search by game or name'
      className='border border-white/10 bg-white/5 w-full h-13 rounded-3xl text-sm text-white placeholder:text-white/40 px-4 outline-none focus:border-purple-500'
    />

    <div className='w-full flex gap-4 items-center justify-start'>
      <span className='px-4 py-2 cursor-pointer text-xs rounded-full bg-purple-500/20 text-purple-300 font-medium border border-purple-400/20'>
        All players
      </span>
      <span className='px-4 py-2 cursor-pointer text-xs rounded-full bg-white/5 text-white/70 font-medium border border-white/10'>
        Game
      </span>
    </div>
  </div>

  <div className='w-full overflow-y-auto grid grid-cols-4 gap-5 border border-white/20 rounded-2xl p-5 bg-white/5'>
    {allusers?.map((user) => {

    const currgame=user?.games?.find(game=>game.game.name===user.currentlyPlaying)
    const isawayingame=currgame?.status==="Away"

    const prevplayed=user?.prevPlayed
    const prevplayedtime=user?.prevPlayingTime

    console.log(currgame)
      return (
        <div
          key={user._id}
          className='w-full min-h-80 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 flex flex-col justify-between shadow-lg hover:scale-[1.02] hover:border-purple-400/30 transition-all duration-300'
        >
          <div>
            <div className='w-full flex items-center gap-4 mb-4'>
              <img
                src={user.image}
                alt=""
                className='w-20 h-20 object-cover rounded-full border-2 border-purple-400/30 shadow-md'
              />

              <div className='flex flex-col'>
                <h1 className='text-xl font-extrabold leading-relaxed text-white'>
                  {user.name}
                </h1>
                <p className='text-sm text-white/50'>
                  {user.status || "Player status not set"}
                </p>
              </div>
            </div>

            <div className='space-y-3'>
              <div className='rounded-2xl bg-white/5 border border-white/10 p-3'>
                <p className='text-xs uppercase tracking-wider text-purple-300 mb-1'>
                  Bio
                </p>
                <p className='text-sm text-white/80'>
                  {user.bio || "Player bio not set"}
                </p>
              </div>

              <div className='rounded-2xl bg-white/5 border border-white/10 p-3'>
                <p className='text-xs uppercase tracking-wider text-purple-300 mb-1'>
                  Activity
                </p>
                <p className='text-sm text-white/80'>
                 {isawayingame
    ? `Away from ${user.currentlyPlaying}`
    : user.currentlyPlaying
    ? `Playing ${user.currentlyPlaying} Currently`
    : user.prevPlayed
    ? `Last played ${prevplayed} for ${prevplayedtime} mins`
    : "Idle"}
                </p>
              </div>
            </div>
          </div>

          <button className='cursor-pointer  w-full mt-5 h-12 flex justify-center items-center gap-3 rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-200 font-semibold hover:bg-purple-900/30 transition-all duration-300'>
            <UserPlus className='w-5 h-5' />
            <span>Add Friend</span>
          </button>
        </div>
      );
    })}
  </div>
</div>
  )
}

export default Souls
