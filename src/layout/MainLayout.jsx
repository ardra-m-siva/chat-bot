import React, { useState } from 'react'
import Sidebar from './Sidebar'
import HomePage from '../pages/HomePage'

const MainLayout = () => {
    const [chatList, setChatList] = useState([])
    const [selectedChat, setselectedChat] = useState(null)
    return (
        <>
            <div className='h-screen flex'>
                {/* #09637E
#088395
#7AB2B2
#EBF4F6 */}
                <div className='w-80 bg-[#09637E]'>
                    <Sidebar chatList={chatList} setChatList={setChatList} selectedChat={selectedChat} setselectedChat={setselectedChat} />
                </div>
                <div className='flex-1 flex flex-col bg-[#EBF4F6] min-h-0'>
                    <div className="h-17 flex justify-between items-center px-4 bg-[#EBF4F6] shrink-0">
                        <span>Chat Header</span>
                        <button><i className="fa-solid fa-ellipsis-vertical cursor-pointer"></i></button>
                    </div>
                    <HomePage selectedChat={selectedChat} />
                </div>
            </div>
        </>
    )
}

export default MainLayout