import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { io } from "socket.io-client";
import { IdCardIcon, SendHorizonal } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChatRoom = ({ id, roomName, user, members }) => {
  const VITE_BASE_URL = "http://localhost:3000";
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [previousMessages, setPreviousMessages] = useState([]);
  const [AllMessages, setAllMessages] = useState([]);
  const chatEndRef = React.createRef();
  const navigate = useNavigate();
  const isJoined = members.includes(user._id);
  const handleJoinRoom = async (e) => {
    // e.preventDefault();
    const token = localStorage.getItem("authToken");

    await axios
      .post(
        `${VITE_BASE_URL}/chatrooms/join`,
        { roomId: id},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(window.location.reload(true))
      .catch((error) => {
        console.error("Error:", error);
        // alert(error.response.data.message);
      });
  }
  useEffect(() => {
    const newSocket = io(VITE_BASE_URL); 
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected:", newSocket.id);
    });

    newSocket.on("previous-messages", (data) => {
      console.log("Messages received:", data);
      setPreviousMessages(data);
    })
    newSocket.on("received", (data) => {
      console.log("Received:", data);
      // AllMessages.push(data);
      setPreviousMessages((prev) => [...prev, data]);
      // console.log(AllMessages)
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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("authToken"); 
        const response = await axios.get(`${VITE_BASE_URL}/messages/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Fetched messages:", response.data);
        setPreviousMessages(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    
    if(id){
      fetchMessages();
    }
  }, [id]);
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatEndRef]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (socket && message.trim() !== "") {
      // console.log("Test", user)
      const newMessage = { message, sentBy: user, id, timestamp: new Date().toLocaleTimeString() };
      socket.emit("message", newMessage);
      setMessage(""); 
      console.log("Test",previousMessages);
    }
  };

  return (
    <div className="flex flex-col justify-between h-[90vh]">
      <h1 className="text-4xl text-white font-[VT323] uppercase mb-8">{roomName}</h1>
      <div className="text-white overflow-y-auto h-[80vh] flex flex-col-reverse gap-1">
        <div ref={chatEndRef} />
        {previousMessages.slice().reverse().map((m, i) => {
          if(i > 1) {
            var prevMsg = previousMessages[i - 1];
          }
          console.log(prevMsg);
          const sentByCurrentUser = m.sentBy.username === user.username;
          return (
          <div key={i} className={`w-fit max-w-[75%] bg-[var(--color-hover-bg)] flex-col rounded-sm justify-center items-center ${sentByCurrentUser ? "ml-auto justify-end" : "mr-auto justify-start"}`}>
            <div className={`text-xs text-[var(--color-accent)] flex pl-1 pr-2 ${prevMsg?.sentBy.username === m.sentBy.username ? "hidden" : "auto"}`}>{sentByCurrentUser ? "" : m.sentBy.username}</div>
            <div className="flex pl-2 pr-2 items-end mb-2">
            <span className="mb-1">{m.text}</span> 
            <span className="text-gray-500 text-xs ml-3 ">{m.sentAt}</span>
            </div>
          </div>
        )})}
      </div>

      {
        isJoined ? 
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
      </form> :
       <button onClick={handleJoinRoom} className="w-[60vw] h-[6vh] font-medium cursor-pointer rounded-lg bg-[#161b21] border-2 hover:bg-[var(--color-hover-bg)]">
          Join Now
       </button>
      }
      
    </div>
  );
};

ChatRoom.propTypes = {
  id: PropTypes.string.isRequired,
  roomName: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  members: PropTypes.array.isRequired
};
export default ChatRoom;
