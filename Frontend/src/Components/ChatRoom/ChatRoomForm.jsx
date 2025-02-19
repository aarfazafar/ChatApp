import React, { useState } from 'react'
import "../LandingPage/LandingPage.css"
import { Plus } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export const ChatRoomForm = () => {
  const VITE_BASE_URL = "http://localhost:3000";
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const [addTag, setAddTag] = useState(false);
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();
  const tagsHandler = (e) => {
    e.preventDefault();
    setAddTag((prev) => !prev);
  }
  const addRoomHandler = async (e) => {
    e.preventDefault();
    console.log(roomName);
    await axios.post(`${VITE_BASE_URL}/chatrooms/create`, roomName).then(response => console.log("Room Created", response.data))
    .catch(error => {
        console.error("Error:", error); 
        // alert(error.response.data.message);
    })
    // navigate("/home")
    setRoomName("")
  }
  const addTagHandler = (e) => {
    e.preventDefault();
    setAddTag((prev) => !prev);
    if(tag.trim() !== "" && tags.length < 5){
      setTags((prev) => [...prev, tag]);
    }
    setTag("");
    console.log(tags);
  }
  return (
  <div className='flex flex-col justify-center items-center h-screen'>
  { addTag ? (
      <div className="h-[30vh] w-[30vw] border-2 border-accent rounded-lg flex flex-col justify-center items-center gap-12">
      <input
        name='newTag'
        onChange={(e) => {
          let text = e.target.value;
          text.length > 5 ? setTag(text.slice(0, 5) + "...") : setTag(text);
        }}
        placeholder='Add Tag'
        className='input-field !w-[15vw]'
      />
      <button
        onClick={addTagHandler}
        className='cursor-pointer bg-[#161b21] hover:bg-[var(--color-hover-bg)] !text-gray-300 px-8 py-2 rounded-lg'>
        Add
      </button>
    </div>  
       ) : (
        <>
        <div className="text-4xl text-white font-[VT323] uppercase">Birth a Shadow Society</div>
        <form className='h-[40vh] w-[30vw] border-2 border-accent rounded-lg flex flex-col justify-center items-center'>
          <input 
            value={roomName}
            onChange={(e) => {
              setRoomName(e.target.value);
            }}
            type="text" 
            className='input-field pl-10 !w-[24vw]' 
            name='newGroup'
            placeholder='Name the shadow'  
          />
          <button
            onClick={addRoomHandler} 
            className='testing !px-32 !py-4 top-0 !mt-8 rounded-lg'
          >
              Summon
          </button>
          <button
            onClick={tagsHandler} 
            className='!flex gap-2 cursor-pointer bg-[#161b21] hover:bg-[var(--color-hover-bg)] !text-gray-300 px-4 py-2 rounded-lg mt-3'>
            <Plus/>
            Add Tags
          </button>
          <div className="flex w-[100%] translate-y-6 gap-3 overflow-hidden">
          {tags.map((m) => (
              <div key={m} className="h-fit w-fit px-4 py-0.5 bg-[#161b21] text-white rounded-4xl flex items-center">
                {m}
              </div>
            ))}
          </div>
        </form> 
      </>   
    )}
  </div>
  )
}
