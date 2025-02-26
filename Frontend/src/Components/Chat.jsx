import React, { useEffect, useMemo, useState } from 'react'
import {io} from "socket.io-client";
const Chat = () => {
  const VITE_BASE_URL = import.meta.env.MODE === "development"
  ? import.meta.env.VITE_BASE_URL_DEV
  : import.meta.env.VITE_BASE_URL;
  const socket = useMemo(() => io(VITE_BASE_URL), [])
  const [message, setMessage] = useState("")
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    })
    socket.on("recieved", (data) => {
      console.log(data);
    })
    return (() => {
      socket.disconnect();
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    setMessage("");
  }
  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-3 justify-center items-center h-[100vh]'>
      <h1 className='text-4xl text-white'>Hello Chat</h1>
      <input value={message} onChange={
        (e) => setMessage(e.target.value)
      } type="text" className='h-10 w-md border-2 text-white rounded-sm'/>
      <button type='submit' className='h-10 w-md border-2 text-black rounded-sm'>Send</button>
    </form>
  )
}

export default Chat
