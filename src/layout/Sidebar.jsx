import React from 'react'

const Sidebar = () => {
    
    return (
        <div className="w-80 h-screen flex flex-col text-white">
            {/* Header */}
            <div className="p-4 text-xl font-semibold flex justify-between">
                <span><i className="fa-regular fa-comment me-2"></i>Chats</span>
                <button><i className="fa-solid fa-ellipsis-vertical fa-sm cursor-pointer"></i></button>
            </div>
            <div className='w-full'>
                <ul>
                    <li className=' p-4 flex items-center gap-2'>
                        <img src="https://cdn-icons-png.freepik.com/512/8742/8742495.png" alt="" className='rounded-full w-8 h-8' />
                        <span>Ameer</span>
                    </li>

                    <li className='bg-[#088295c7] p-4 flex items-center gap-2'>
                        <img src="https://cdn-icons-png.freepik.com/512/8742/8742495.png" alt="" className='rounded-full w-8 h-8' />
                        <span>Ardra</span>
                    </li>

                </ul>
            </div>
        </div>
    )
}

export default Sidebar