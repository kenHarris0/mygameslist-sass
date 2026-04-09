import React from 'react'
import SupportImage from '../assets/support.jpeg'

const Supportpage = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#0f172a] text-white px-4">

      <div className="w-full max-w-xl bg-[#111827] rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6">

        {/* Title */}
        <h1 className="text-3xl font-bold">Support My Work ❤️</h1>

        {/* Intro */}
        <p className="text-center text-gray-400 text-sm">
          Hi, I’m Harish  — a full-stack developer and AI engineer building full stack  applications that creates an impact for all users. 
          If you like my work or it helped you, consider supporting me 
        </p>

        {/* Patreon Button */}
        <a
          href="https://patreon.com/kenHarris0"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <button className="w-full bg-orange-500 hover:bg-orange-600 transition px-4 py-3 rounded-lg font-semibold">
            Support on Patreon 🚀
          </button>
        </a>

        {/* Divider */}
        <div className="w-full flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="text-gray-400 text-xs">OR</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* UPI Section */}
        <div className="flex flex-col items-center gap-3">

          <p className="text-sm text-gray-400">Pay via UPI (GPay / PhonePe)</p>

          {/* QR (you'll replace src later) */}
          <div className="w-40 h-40 bg-gray-800 flex items-center justify-center rounded-lg">
            <span className="text-xs text-gray-500"><img src={SupportImage} alt="" className='object-cover'/></span>
          </div>

          {/* UPI ID */}
          <p className="text-sm font-mono bg-gray-800 px-3 py-1 rounded">
            harishthebot123-1@oksbi
          </p>

          {/* Safety note */}
          <p className="text-[10px] text-gray-500 text-center">
            ⚠️ I will never request money. Please don’t approve unknown payment requests.
          </p>

        </div>

      </div>

    </div>
  )
}

export default Supportpage