import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { io } from "socket.io-client";
import { IdCardIcon, SendHorizonal } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Linkify from "react-linkify";
import ContextMenu from "../ContextMenu/ContextMenu";
const ChatRoom = ({ id, roomName, user, members }) => {
  const VITE_BASE_URL = "http://localhost:3000";
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [previousMessages, setPreviousMessages] = useState([]);
  const [AllMessages, setAllMessages] = useState([]);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const chatEndRef = React.createRef();
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  const isJoined = members.includes(user._id);
  const [leave, setLeave] = useState(false);
  const [menu, setMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    messageId: null,
  });
  const menuRef = useRef(null);

  const handleJoinRoom = async (e) => {
    // e.preventDefault();
    const token = localStorage.getItem("authToken");

    await axios
      .post(
        `${VITE_BASE_URL}/chatrooms/join`,
        { roomId: id },
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
  };
  useEffect(() => {
    const newSocket = io(VITE_BASE_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected:", newSocket.id);
    });

    newSocket.on("previous-messages", (data) => {
      console.log("Messages received:", data);
      setPreviousMessages(data);
    });
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
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched messages:", response.data);
        setPreviousMessages(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (id) {
      fetchMessages();
    }
  }, [id]);
  useEffect(() => {
    if (!menu.visible && isUserAtBottom && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatEndRef, menu.visible]);

  const checkScrollPosition = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setIsUserAtBottom(scrollHeight - scrollTop <= clientHeight + 10);
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    chatContainer.addEventListener("scroll", checkScrollPosition);
    return () =>
      chatContainer.removeEventListener("scroll", checkScrollPosition);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (socket && message.trim() !== "") {
      // console.log("Test", user)
      const newMessage = {
        message,
        sentBy: user,
        id,
        timestamp: new Date().toLocaleTimeString(),
      };
      socket.emit("message", newMessage);
      // setPreviousMessages((prev) => [...prev, newMessage]);
      setMessage("");
      // console.log("Test", previousMessages);
    }
  };

  const handleContextClick = () => {
    setMenu({ visible: false, x: 0, y: 0, messageId: null });
  };

  const handleContextMenu = (e, messageId) => {
    e.preventDefault(); 
  
    setMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      messageId,
    });
  };
  
  const handleLeave = (e) => {
    e.preventDefault();
    setLeave(true)
  }

  const handleLeaveRoom = async (e) => {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(`${VITE_BASE_URL}/chatrooms/leave`, { roomId: id, userId: user._id }, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(setLeave(false));
    console.log(response)
    window.location.reload(true);
  }
  return (
    <div
      className="flex flex-col justify-between h-[calc(100vh-<HEADER_HEIGHT>px)] max-h-[90vh] overflow-y-hidden"
      onClick={handleContextClick}
    >
      {leave && (
  <div className="fixed inset-0 flex items-center justify-center z-50 h-screen w-screen backdrop-blur-sm bg-transparent">
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-64 w-[30vw] border-2 flex flex-col justify-between items-center border-accent rounded-lg bg-[#161b21] py-8">
      <h1 className="text-2xl">Leave Room</h1>
      <div className="flex w-full h-1/4">
        <button 
        onClick={handleLeaveRoom}
        className="w-1/2 hover:bg-[var(--color-hover-bg)] hover:rounded-lg cursor-pointer">
          OK
        </button>
        <button
          onClick={() => setLeave(false)} 
          className="w-1/2 hover:bg-[var(--color-hover-bg)] hover:rounded-lg cursor-pointer"
        >
          CANCEL
        </button>
      </div>
    </div> 
  </div>
)}

      <div className="flex justify-between items-center">
        <h1 className="text-4xl text-white font-[VT323] uppercase mb-8">
          {roomName}
        </h1>
        {
          members.includes(user._id) && <button
          onClick={handleLeave}
          className="mb-8 w-[20%] border-2 rounded-lg hover:bg-[var(--color-hover-bg)] cursor-pointer h-[50%]"  
        >
          Leave Room
        </button>
        }
      </div>
      <div className="text-white overflow-y-auto h-[80vh] flex flex-col-reverse gap-1">
        <div ref={chatEndRef} />
        {members.includes(user._id) && previousMessages
          .slice()
          .reverse()
          .map((m, i) => {
            return (
              <div
                key={i}
                className={`w-fit  max-w-[75%] bg-[var(--color-hover-bg)] flex-col rounded-sm justify-center items-center ${
                  m.sentBy._id === user._id
                    ? "ml-auto justify-end"
                    : "mr-auto justify-start"
                }`}
                onContextMenu={(e) => handleContextMenu(e, m._id)}
              >
                <div className="text-xs text-[var(--color-accent)]">
                  {m.sentBy.username}
                </div>

                <div className="flex pl-2 pr-2 items-end mb-2">
                  
                  <Linkify
                    componentDecorator={(href, text, key) => (
                      <a
                        href={href}
                        key={key}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        {text}
                      </a>
                    )}
                  >
                    <span className="mb-1">{m.text}</span>
                  </Linkify>
                  <span className="text-gray-500 text-xs ml-3 ">
                    {m.sentAt}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
      {menu.visible && (
        <div
          ref={menuRef}
          className="absolute w-fit"
          style={{ top: `${menu.y}px`, left: `${menu.x}px` }}
        >
          <ContextMenu messageId={menu.messageId} />
        </div>
      )}
      {isJoined ? (
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

            <button
              type="submit"
              className="h-10 w-10 rounded-t-full rounded-b-full cursor-pointer flex justify-center p-2 border-2 text-black rounded-sm"
            >
              <SendHorizonal />
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={handleJoinRoom}
          className="w-[60vw] h-[6vh] font-medium cursor-pointer rounded-lg bg-[#161b21] border-2 hover:bg-[var(--color-hover-bg)]"
        >
          Join Now
        </button>
      )}
    </div>
  );
};

ChatRoom.propTypes = {
  id: PropTypes.string.isRequired,
  roomName: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  members: PropTypes.array.isRequired,
};
export default ChatRoom;
