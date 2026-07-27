import React, { useEffect } from 'react'
import AxiosCall from '../services/AxiosCall'

const Sidebar = ({ chatList, setChatList, selectedChat, setselectedChat }) => {

    useEffect(() => {
        fetchChatList()
    }, [])

    async function fetchChatList() {
        try {
            const result = await AxiosCall('GET', 'chats', {})
            console.log(result);

            if (result.status == 200) {
                setChatList(result.data?.data)
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="w-80 h-screen flex flex-col text-white">
            {/* Header */}
            <div className="p-4 text-xl font-semibold flex justify-between">
                <span><i className="fa-regular fa-comment me-2"></i>Chats</span>
                <button><i className="fa-solid fa-ellipsis-vertical fa-sm cursor-pointer"></i></button>
            </div>
            <div className='w-full'>
                <ul>
                    {chatList?.length > 0 && chatList?.map((chat, index) => (
                        <li onClick={() => setselectedChat(chat)} key={index} className={`${selectedChat?._id == chat._id ? 'bg-[#088295c7] ' : ''} p-4 flex items-center gap-2 cursor-pointer`}>
                            <img src={chat?.participants[0]?.avatar ? chat?.participants[0]?.avatar : "https://cdn-icons-png.freepik.com/512/8742/8742495.png"} alt="" className='rounded-full w-8 h-8' />
                            <span>{chat?.participants[0]?.name}</span>
                        </li>))}
                </ul>
            </div>
        </div>
    )
}

export default Sidebar