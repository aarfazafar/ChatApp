import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { io } from "socket.io-client";
import { SendHorizonal } from "lucide-react";

const ChatRoom = ({ id, name }) => {
  const VITE_BASE_URL = "http://localhost:3000";
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [AllMessages, setAllMessages] = useState([]);
  const chatEndRef = React.createRef();

  useEffect(() => {
    const newSocket = io(VITE_BASE_URL); 
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected:", newSocket.id);
    });

    newSocket.on("received", (data) => {
      console.log("Received:", data);
      // AllMessages.push(data);
      setAllMessages((prev) => [...prev, data]);
      console.log(AllMessages)
    });

    newSocket.on("welcome", (data) => {
      console.log("Welcome:", data);
    });

    return () => {
      newSocket.disconnect(); 
    };
  }, []); 

  useEffect(() => {
    if (socket) {
      socket.emit("leave-room", id); 
      setAllMessages([]);
      socket.emit("join-room", id); 
    }
  }, [id, socket]);
  

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatEndRef]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (socket && message.trim() !== "") {
      const newMessage = { message, id, timestamp: new Date().toLocaleTimeString() };
      // setAllMessages((prev) => [...prev, newMessage])
      socket.emit("message", newMessage);
      setMessage(""); 
    }
  };

  return (
    <div className="flex flex-col justify-between h-[90vh]">
      <h1 className="text-4xl text-white font-[VT323] uppercase mb-8">{name}</h1>
      <div className="text-white overflow-y-auto h-[80vh] flex flex-col-reverse">
        <div ref={chatEndRef} />
        {AllMessages.slice().reverse().map((m, i) => (
          <div key={i} className="h-[4vh] w-fit bg-[#1e1e1e] rounded-sm pl-4 pr-4 flex items-end mb-3">
            <span>{m.message}</span>
            <span className="text-gray-500 text-xs ml-3 ">{m.timestamp}</span>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-3 justify-start items-start mt-4 "
      >
        <div className="flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            className="h-10 w-[60vw] p-4 border-2 text-white rounded-sm"
            placeholder="Type your message..."
          />

          <button type="submit" className="h-10 w-10 rounded-t-full rounded-b-full cursor-pointer flex justify-center p-2 border-2 text-black rounded-sm">
            <SendHorizonal/>
          </button>
        </div>
      </form>
    </div>
  );
};
ChatRoom.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};
export default ChatRoom;
