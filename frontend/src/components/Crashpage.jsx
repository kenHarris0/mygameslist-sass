import React from 'react'
import { Link } from 'react-router-dom';


const Crashpage = () => {
  return (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-4">Page not found</p>

      <Link
        to="/"
        className="mt-6 px-5 py-2 bg-blue-500 text-white rounded-lg"
      >
        Go Home
      </Link>
    </div>
  );
}

export default Crashpage
