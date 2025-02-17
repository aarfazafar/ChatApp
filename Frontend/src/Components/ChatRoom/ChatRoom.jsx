import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const ChatRoom = ({ id }) => {
  const VITE_BASE_URL = "http://localhost:3000";
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [AllMessages, setAllMessages] = useState([]);

  useEffect(() => {
    const newSocket = io(VITE_BASE_URL); 
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected:", newSocket.id);
    });

    newSocket.on("received", (data) => {
      console.log("Received:", data);
      setAllMessages((prevMessages) => [...prevMessages, data]);
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
      socket.emit("join-room", id); 
      setAllMessages([]); 
    }
  }, [id, socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (socket) {
      socket.emit("message", { message, id });
      setMessage("");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 justify-center items-center h-[50vh]"
      >
        <h1 className="text-4xl text-white">Hello Chat</h1>

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          className="h-10 w-md border-2 text-white rounded-sm"
          placeholder="Type your message..."
        />

        <button type="submit" className="h-10 w-md border-2 text-black rounded-sm">
          Send
        </button>
      </form>

      <div className="text-white">
        {AllMessages.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>
    </div>
  );
};

export default ChatRoom;
