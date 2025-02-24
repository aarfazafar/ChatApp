import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { io } from "socket.io-client";
import { SendHorizontal } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Linkify from "react-linkify";
import ContextMenu from "../ContextMenu/ContextMenu";
const ChatRoom = ({ id, roomName, user, members }) => {
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
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
    console.log(id)
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
      .then(console.log(`user ${user.username} join room ${id} successfully`))
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
    setLeave(true);
  };

  const handleLeaveRoom = async (e) => {
    const token = localStorage.getItem("authToken");
    const response = await axios
      .post(
        `${VITE_BASE_URL}/chatrooms/leave`,
        { roomId: id, userId: user._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(setLeave(false));
    console.log(response);
    window.location.reload(true);
  };
  return (
    <div
      className="flex flex-col justify-between w-full min-h-screen flex-1"
      onClick={handleContextClick}
    >
      {leave && (
        <div className="fixed inset-0 flex items-center justify-center z-50 h-screen w-screen bg-transparent">
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-h-64
       w-[90vw] sm:w-[70vw] md:w-[60vw] lg:w-[40vw] xl:w-[30vw] border-2 border-accent rounded-lg 
       bg-[#161b21] p-4 sm:p-8 flex flex-col justify-between items-center"
          >
            <h1 className="text-6xl tracking-wide vtFont">Leave Room</h1>
            <p className="text-lg">Are you sure you want to leave the room?</p>
            <div className="flex justify-center w-full gap-2">
              <button
                onClick={() => setLeave(false)}
                className="w-1/4 py-2 rounded-md transition-all duration-300 
         hover:bg-[rgba(79,255,79,0.1)] hover:shadow-[0_0_30px_rgba(79,255,79,0.3)]
         active:scale-[0.98] uppercase tracking-wider hover:rounded-lg cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handleLeaveRoom}
                className="w-1/4  py-2 rounded-md transition-all duration-300 
         hover:bg-[rgba(79,255,79,0.1)] hover:shadow-[0_0_30px_rgba(79,255,79,0.3)]
         active:scale-[0.98] uppercase tracking-wider] hover:rounded-lg cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between p-4 items-center">
        <h1 className="text-3xl sm:text-5xl text-white font-[VT323] uppercase">
          {roomName}
        </h1>
        {members.includes(user._id) && (
          <button
            onClick={handleLeave}
            className="py-2 px-4 border-2 cursor-pointer rounded-md transition-all duration-300 
         hover:bg-[rgba(79,255,79,0.1)] hover:shadow-[0_0_30px_rgba(79,255,79,0.3)]
         active:scale-[0.98] uppercase tracking-wider"
          >
            Leave
          </button>
        )}
      </div>

      <div className="text-white overflow-y-auto h-[80vh] sm:h-[80vh] flex flex-col-reverse gap-2 p-2 sm:px-8">
        <div ref={chatEndRef} />
        {members.includes(user._id) &&
          previousMessages
            .slice()
            .reverse()
            .map((m, i, arr) => {
              const isLastMessage = i === arr.length - 1;
              const isNewUser =
                isLastMessage || arr[i + 1]?.sentBy._id !== m.sentBy._id;
              return (
                <div
                  key={i}
                  className={`w-fit px-1.5 pt-1 max-w-[75%] bg-[var(--color-input-bg)] border-b border-r border-[var(--color-input-border)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] flex-col rounded-tl-[4px] rounded-tr-[10px] rounded-br-[4px] rounded-bl-[10px] justify-center items-center ${
                    m.sentBy._id === user._id
                      ? "ml-auto justify-end"
                      : "mr-auto justify-start"
                  }`}
                  onContextMenu={(e) => handleContextMenu(e, m._id)}
                >
                  {isNewUser && (
                    <div className="text-xs text-[var(--color-accent)]">
                      {m.sentBy.username}
                    </div>
                  )}
                  <div className="flex pl-2 pr-2 items-end justify-between mb-2">
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
                    <span className="text-gray-500 text-xs ml-3 ali">
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
          className="flex h-auto gap-3 items-center pl-2 pb-3"
        >
          <div className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              className="h-10 w-[75vw] sm:w-[60vw] bg-[var(--color-input-bg)] px-4 py-6 border border-[var(--color-input-border)] focus:outline-none transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_0_20px_rgba(0,255,255,0.2)] backdrop-blur-md text-white rounded-lg"
              placeholder="Type your message..."
            />

            <button
              type="submit"
               className="h-10 w-10 rounded-t-full rounded-b-full cursor-pointer flex justify-center p-2 border-2 text-black rounded-sm transition-all duration-300 hover:bg-[rgba(79,255,79,0.1)] hover:shadow-[0_0_30px_rgba(79,255,79,0.3)]"
            >
              <SendHorizontal />
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={handleJoinRoom}
          className="w-[60vw] h-[6vh] ml-15 mb-4 font-medium cursor-pointer rounded-lg bg-[#161b21] border-2 hover:bg-[var(--color-hover-bg)]"
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
