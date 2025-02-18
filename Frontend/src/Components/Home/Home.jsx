import React, { useEffect, useState } from "react";
import {
  Ghost,
  Users,
  Clock,
  Plus,
  Search,
  Sparkles,
  Settings,
  ArrowLeft,
  Moon,
  Volume2,
  Eye,
  Shield,
} from "lucide-react";
import "./Home.css";
import ChatRoom from "../ChatRoom/ChatRoom";
import Setting from "../Settings/Setting";
import { generate } from "random-words";
 
const demoData = [
  {
    id: 1,
    name: "Cyber Security",
    tags: ["tech", "security"],
    users: 42,
    timeLeft: "2h",
  },
  {
    id: 2,
    name: "Philosophy Night",
    tags: ["deep-thoughts"],
    users: 28,
    timeLeft: "1h",
  },
  {
    id: 3,
    name: "Music Producers",
    tags: ["music", "art"],
    users: 15,
    timeLeft: "30m",
  },
  {
    id: 4,
    name: "Conspiracy Theories",
    tags: ["mystery"],
    users: 56,
    timeLeft: "3h",
  },
  {
    id: 5,
    name: "Code Warriors",
    tags: ["programming"],
    users: 31,
    timeLeft: "45m",
  },
  
];
const randomName = generate({
  exactly: 3,
  wordsPerString: 1,
  minLength: 7,
  separator: "_",
  formatter: (word, index) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  },
}).join("");

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [id, setId] = useState(0);
  const [randomUserName, setRandomUser] = useState(randomName);
  console.log("Rendering Home with id:", id);
  
  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setShowMobileChat(true);
    setId(room.id);
  };

  
  const handleBackToRooms = () => {
    setShowMobileChat(false);
    setId(0);
  };

  // useEffect(()=>{}, [randomUserName])
  //[#141b2d]/80
  //bg-[var(--color-dark-secondary)]
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
                <h2 className="font-bold ">{randomUserName}</h2>
                <p className="text-sm text-gray-400">
                  Lurking in the shadows...
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-[#2a3347] rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-[var(--color-accent)] transition ease-in-out duration-75 hover:rotate-90" />
            </button>
          </div>

          {showSettings && (
              <Setting randomName={randomName}/>
          )}
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
            <input
              type="text"
              placeholder="Search rooms..."
              className="w-full bg-[#0a0f1e] border border-[#2a3347] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#00ffff] transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {demoData.map((room) => (
              <div
                key={room.id}
                className="p-3 rounded-lg hover:bg-[var(--color-hover-bg)] cursor-pointer transition-colors group"
                onClick={() => handleRoomSelect(room)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                    {room.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-[var(--color-text-tertiary)]">
                    <Users className="w-4 h-4" />
                    <span>{room.users}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {room.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 pb-1.5 pt-1 rounded-full bg-[var(--color-input-bg)] text-[var(--color-text-tertiary)]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-xs [var(--color-text-tertiary)]">
                    <Clock className="w-3 h-3" />
                    <span className=" [var(--color-text-tertiary)]">
                      {room.timeLeft}
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
          <button className="plus-button group-hover:animate-pulse  relative">
            <Plus className="w-4 h-4 absolute top-4 left-35" />
            <div>Create Room</div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 ${
          !showMobileChat ? "hidden md:flex" : "flex"
        } flex-col`}
      >
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-[#2a3347] bg-[#141b2d]/80">
          <button
            onClick={handleBackToRooms}
            className="flex items-center gap-2 text-[#00ffff]"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Rooms
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-8 flex items-center justify-center">
          {selectedRoom ? (
            // <div className="text-center">
            //   <h2 className="text-2xl font-bold mb-4">{selectedRoom.name}</h2>
            //   <p className="text-gray-400 mb-6">
            //     chat area.....
            //   </p>
            // </div>
            <ChatRoom id={id} name = {selectedRoom.name}/>
          ) : (
            <div className="text-center space-y-4">
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
