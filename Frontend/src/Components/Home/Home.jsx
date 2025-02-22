import React, { useEffect, useState } from "react";
import {
  Ghost,
  Users,
  Clock,
  Plus,
  Search,
  Settings,
  ArrowLeft,
} from "lucide-react";
import "./Home.css";
import ChatRoom from "../ChatRoom/ChatRoom";
import Setting from "../Settings/Setting";
import { generate } from "random-words";
import axios from "axios";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
function Home() {
  const [token, setToken] = useState("");
  const location = useLocation();
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [id, setId] = useState("");
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  // console.log("Rendering Home with id:", id);
  const [user, setUser] = useState({});
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getUser();
    }
  }, [token]);

  async function getUser() {
    try {
      if (!token) return;
      const res = await axios.get(`${VITE_BASE_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setUser(res.data);
      console.log("User fetched:", res.data);
      // console.log(rooms);
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  }

  useEffect(() => {
    const allRooms = async () => {
      try {
        const data = await axios.get(`${VITE_BASE_URL}/chatrooms/allRooms`);
        console.log(data);
        setRooms(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    allRooms();
  }, []);
  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setShowMobileChat(true);
    setId(room._id);
  };

  const myRooms = rooms.filter((room) => room.members.includes(user?._id));
  const displayRooms = activeTab === "all" ? rooms : myRooms;
  const handleBackToRooms = () => {
    setShowMobileChat(false);
    setId("");
  };
  const [randomUserName, setRandomUser] = useState(() => {
    return generate({
      exactly: 3,
      wordsPerString: 1,
      minLength: 7,
      separator: "_",
      formatter: (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      },
    }).join("");
  });
  return (
    <div className="home-app min-h-screen bg-[#0a0f1e] text-gray-100 flex">
      {/* Sidebar*/}
      <div
        className={`w-full max-h-screen overflow-hidden lg:w-120 md:w-80 bg-[var(--color-dark-secondary)]/80 backdrop-blur-md border-r border-[#2a3347] flex flex-col 
                      ${showMobileChat ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-4 border-b border-[#2a3347]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Ghost className="w-8 h-8 text-[var(--color-accent)] transition ease-in-out hover:-translate-y-1" />
              <div>
                <h2 className="font-bold ">{user.username}</h2>
                <p className="text-sm text-gray-400">
                  Lurking in the shadows...
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-[var(--color-input-bg)] rounded-xl transition-colors"
            >
              <Settings
                className={`w-5 h-5 text-[var(--color-accent)] transition ease-in-out duration-75 ${
                  showSettings ? "rotate-90" : ""
                }`}
                onClick={() => setOpenSettings(true)}
              />
            </button>
          </div>

          {showSettings && (
            <Setting
              isOpen={openSettings}
              onClose={() => setOpenSettings(false)}
              randomName={user.username}
              token={token}
            />
          )}
        </div>

        <div className="px-1 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
            <input
              type="text"
              placeholder="Search rooms..."
              className="input-field focus:border-none border-b-accent w-full h-10 rounded-lg !pl-[1rem] transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex px-1">
          <button
            onClick={() => setActiveTab("all")}
            className={`!w-[50%] cursor-pointer py-2 rounded-lg ${
              activeTab === "all"
                ? "bg-[var(--color-input-bg)] border-b border-r border-[var(--color-input-border)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                : "bg-[#161b21]"
            }`}
          >
            All Rooms
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={`!w-[50%] cursor-pointer py-2 rounded-lg ${
              activeTab === "my"
                ? "bg-[var(--color-input-bg)] border-b border-r border-[var(--color-input-border)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                : "bg-[#161b21]"
            }`}
          >
            My Rooms
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {displayRooms
              .filter((item) => {
                return item.name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase());
              })
              .map((room) => (
                <div
                  key={room._id}
                  className="p-3 rounded-lg hover:bg-[var(--color-input-bg)] cursor-pointer transition-colors duration-300  group"
                  onClick={() => handleRoomSelect(room)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                      {room.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-[var(--color-text-tertiary)]">
                      <Users className="w-4 h-4" />
                      <span>{room.members.length}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 flex-wrap">
                      {room.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 pb-1.5 pt-1 rounded-full bg-[var(--color-input-bg)] text-[var(--color-text-tertiary)]"
                        >
                          {`#${tag}`}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs [var(--color-text-tertiary)]">
                      <Clock className="w-3 h-3" />
                      <span className=" [var(--color-text-tertiary)]">
                        {moment(room.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="flex flex-col align-center justify-center p-4 border-t border-[var(--color-accent)]">
          {/* <button type="submit" className="submit-button group">
              <span className="group-hover:animate-pulse">Step into the shadows</span>
            </button> */}
          <button
            onClick={() => {
              navigate("/join");
            }}
            className="plus-button group-hover:animate-pulse  relative"
          >
            <Plus className="w-4 h-4 absolute top-4 left-35" />
            <div>Create Room</div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`h-[100vh] ${!showMobileChat ? "hidden md:flex w-[70%] justify-center items-center" : "flex"}`}
      >
        {/* Mobile Header */}
        <div className="md:hidden pt-6 pl-2 text-center border-b border-[#2a3347]">
          <button
            onClick={handleBackToRooms}
            className="flex items-center gap-2 text-[#00ffff]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 h-[100%]">
          {selectedRoom ? (
            // <div className="text-center">
            //   <h2 className="text-2xl font-bold mb-4">{selectedRoom.name}</h2>
            //   <p className="text-gray-400 mb-6">
            //     chat area.....
            //   </p>
            // </div>
            <ChatRoom
              id={id}
              roomName={selectedRoom.name}
              user={user}
              members={selectedRoom.members}
            />
          ) : (
            <div className="text-center space-y-4 sticky top-[30%]">
              <Ghost className="w-20 h-20 text-[var(--color-accent)] mx-auto mb-4 motion-safe:animate-bounce" />
              <h2 className="vtFont text-5xl font-[var(--font-vt)]-900 text-[var(--color-accent)]">
                Welcome to the Void
              </h2>
              <p className="text-[var(--color-text-tertiary)] opacity-50 max-w-md mx-auto">
                Join a room from the sidebar or create your own. Remember, all
                conversations vanish when the room dissolves...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
