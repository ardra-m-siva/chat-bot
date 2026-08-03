import React, { useContext, useEffect, useRef, useState } from 'react'
import AxiosCall from '../services/AxiosCall';
import socket from '../socket/socket';
import { AuthContext } from '../contexts/AuthContext';

const HomePage = ({ selectedChat }) => {
  const [allMessageList, setAllMessageList] = useState([])
  const [text, setText] = useState('')
  const { user } = useContext(AuthContext)
  const bottomRef = useRef(null);

  useEffect(() => {
    if (selectedChat) {
      getAllMessages()
    }
  }, [selectedChat])

  const getAllMessages = async () => {
    try {
      const result = await AxiosCall('GET', `messages?chatId=${selectedChat?._id}`,)
      console.log(result);
      if (result?.status == 200) {
        setAllMessageList(result.data?.data)
        setText('')
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!user) return;

    if (socket.connected) {
      socket.emit("join", user?.id);
    }

    socket.on("connect", () => {
      socket.emit("join", user?.id);
    });

    socket.on("receiveMessage", (data) => {
      setAllMessageList(prev => [...prev, data]);
    });

    return () => {
      socket.off("connect");
      socket.off("receiveMessage");
    };
  }, [user]);

  useEffect(() => {
    bottomRef.current.scrollIntoView({
      bahavior: 'smooth',
      block: 'end'
    })
  }, [allMessageList])

  const sendMessage = async () => {
    try {
      const result = await AxiosCall('POST', `messages`, { chatId: selectedChat?._id, text })
      if (result.status == 200) {
        console.log(result.data?.message);
        getAllMessages()
      }
    } catch (error) {
      console.error(error);

    }
  }

  return (
    <div className='flex-1 flex flex-col min-h-0 bg-[#7ab2b23d] p-2'>
      <div className='overflow-y-auto flex-1 p-4'>
        {
          allMessageList?.map((message, index) => {
            const isMe = message.senderId === user.id;
            const prevMessage = allMessageList[index - 1];
            const nextMessage = allMessageList[index + 1];

            const isFirstInGroup = !prevMessage || prevMessage.senderId !== message.senderId;
            const isLastInGroup = !nextMessage || nextMessage.senderId !== message.senderId;
            const isSingleMessage = isFirstInGroup && isLastInGroup;

            return (
              <div key={message._id}
                className={`${isMe ? "text-right " : "text-left"} my-1 `}>
                <span className={`
                px-3 py-2 inline-block ${isMe
                    ? isSingleMessage
                      ? "bg-[#09637E] text-white rounded-2xl"
                      : `bg-[#09637E] text-white rounded-l-2xl
                        ${isFirstInGroup ? "rounded-tr-2xl" : "rounded-tr-md"}
                        ${isLastInGroup ? "rounded-br-2xl" : "rounded-br-md"}`
                    : isSingleMessage
                      ? "bg-white rounded-2xl"
                      : `bg-white rounded-r-2xl
                        ${isFirstInGroup ? "rounded-tl-2xl" : "rounded-tl-md"}
                        ${isLastInGroup ? "rounded-bl-2xl" : "rounded-bl-md"}`
                  } `}
                  key={index}>{message.text}
                  <span className='text-[10px] '>
                    {new Date(message?.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", })}
                    <i className="fa-solid fa-check"></i>
                  </span>
                </span>
              </div>
            )
          })
        }
        <div ref={bottomRef}></div>
      </div>
      <div className='w-full flex my-2 px-3  shrink-0'>
        <input value={text} onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }} onChange={(e) => setText(e.target.value)} type="text" className='border w-full border-[#09637E] rounded-md py-2 px-3 me-3 focus:outline-none focus:ring-1 focus:ring-[#09637E] transition-all' placeholder='Message' />
        <button aria-label='send message'
          onClick={sendMessage}
          className='bg-[#09637E] text-white py-2 px-3 rounded-md cursor-pointer'>
          <i className="fa-regular fa-paper-plane"></i>
        </button>
      </div>
    </div>
  )
}

export default HomePage