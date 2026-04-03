import React from 'react'

const HomePage = () => {
  return (
    <div className='h-screen flex flex-col justify-between bg-[#7ab2b23d] p-2'>
      <div>

      </div>
      <div className='w-full flex mb-3 px-3'>
        <input type="text" className='border w-full border-[#09637E] rounded-md py-2 px-3 me-3 focus:outline-none focus:ring-1 focus:ring-[#09637E] transition-all' placeholder='Message'/>
        <button className='bg-[#09637E] text-white py-2 px-3 rounded-md'><i className="fa-regular fa-paper-plane"></i></button>
      </div>
    </div>
  )
}

export default HomePage