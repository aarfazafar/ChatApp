import React, { useState } from "react";
import "../LandingPage/LandingPage.css";
import { Plus, Camera, ArrowBigLeft } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
export const ChatRoomForm = () => {
  const VITE_BASE_URL =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_BASE_URL_DEV
      : import.meta.env.VITE_BASE_URL;
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const [addTag, setAddTag] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [icon, setIcon] = useState(null);
  const [expiryDuration, setExpiryDuration] = useState(86400);


  const navigate = useNavigate();
  const tagsHandler = (e) => {
    e.preventDefault();
    setAddTag((prev) => !prev);
  };
  const addRoomHandler = async (e) => {
    e.preventDefault();
    console.log(roomName);
    // console.log(icon)
    const token = localStorage.getItem("authToken");
    console.log(token);
    await axios
      .post(
        `${VITE_BASE_URL}/chatrooms/create`,
        { name: roomName, tags: tags, icon: icon, expiryDuration: expiryDuration  },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => console.log("Room Created", response.data))
      .catch((error) => {
        console.error("Error:", error);
        // alert(error.response.data.message);
      });
    navigate("/home");
    setRoomName("");
  };
  const addTagHandler = (e) => {
    e.preventDefault();
    setAddTag((prev) => !prev);
    if (tag.trim() !== "" && tags.length < 5) {
      setTags((prev) => [...prev, tag]);
    }
    setTag("");
    console.log(tags);
  };

  const sendIcon = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader(file);
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      setIcon(reader.result);
    };
  };
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <Link to="/home" className="flex gap-2 items-center md:text-xl text-white absolute top-8 left-8">
        <ArrowBigLeft/>
        Back
      </Link>
      {addTag ? (
        <div className="h-[30vh] w-[60vw] md:w-[30vw] border-2 border-accent rounded-lg flex flex-col justify-center items-center gap-12 p-4">
          <input
            name="newTag"
            onChange={(e) => {
              let text = e.target.value;
              text.length > 5 ? setTag(text.slice(0, 5) + "...") : setTag(text);
            }}
            placeholder="Add Tag"
            className="w-full input-field"
          />
          <div className="flex justify-between gap-4">
            <button
              onClick={addTagHandler}
              className="w-full cursor-pointer bg-[#161b21] hover:bg-[var(--color-hover-bg)] !text-gray-300 px-2 md:px-8 py-2 rounded-lg"
            >
              Add
            </button>
            <button
              onClick={(e) => {
                setAddTag((prev) => !prev);
              }}
              className="w-full cursor-pointer bg-[#161b21] hover:bg-[var(--color-hover-bg)] !text-gray-300 px-2 md:px-8 py-2 rounded-lg"
            >
              Cancel
            </button>

          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center items-center px-8">
          <div className="text-4xl text-white font-[VT323] uppercase pb-1">
            Birth a Shadow Society
          </div>
          <form className="h-[50vh] w-full md:w-[30vw] border-2 border-accent rounded-lg flex flex-col justify-center items-center ">
            <div className="flex-col justify-center items-center w-full text-center">
              <input
                value={roomName}
                onChange={(e) => {
                  setRoomName(e.target.value);
                }}
                type="text"
                className="input-field !w-2/3"
                name="newGroup"
                placeholder="Name the shadow"
              />
              <div className="mt-4 flex flex-col items-center w-full">
                <label className="text-gray-300 mb-2">Room Duration</label>
                <select
                  value={expiryDuration}
                  onChange={(e) => setExpiryDuration(Number(e.target.value))}
                  className="input-field !w-2/3"
                >
                  <option value={60}>1 Minutes</option>
                  <option value={1800}>30 Minutes</option>
                  <option value={3600}>1 Hour</option>
                  <option value={7200}>2 Hours</option>
                  <option value={21600}>6 Hours</option>
                  <option value={86400}>24 Hours</option>
                  <option value={604800}>7 Days</option>
                </select>
              </div>

              <button
                onClick={addRoomHandler}
                className="testing !w-2/3 top-0 !mt-8 rounded-lg"
              >
                Summon
              </button>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={tagsHandler}
                className="!flex gap-2 cursor-pointer bg-[#161b21] hover:bg-[var(--color-hover-bg)] !text-gray-300 px-4 py-2 rounded-lg"
              >
                <Plus />
                Add Tags
              </button>
              {!icon ? (
                <label
                  htmlFor="file"
                  className="px-4 py-2 text-[var(--color-text-secondary)] bg-[#161b21] hover:bg-[var(--color-hover-bg)] cursor-pointer rounded-lg flex justify-center gap-2"
                >
                  Group Icon
                  <input
                    type="file"
                    id="file"
                    style={{ display: "none" }}
                    accept="image/jpg,image/jpeg,image/png,image/gif"
                    onChange={sendIcon}
                  />
                  <Camera />
                </label>
              ) : (
                <>
                  <img className="w-10 h-10 rounded-full" src={icon} alt="Icon" />
                  <button
                    className="w-10 h-10 rounded full text-black"
                    onClick={(e) => {
                      e.preventDefault();
                      setIcon(null);
                    }}
                  >
                    x
                  </button>
                </>
              )}
            </div>

            <div className="flex w-[100%] translate-y-6 gap-3 overflow-hidden">
              {tags.map((m) => (
                <div
                  key={m}
                  className="h-fit w-fit px-4 py-0.5 bg-[#161b21] text-white rounded-4xl flex items-center"
                >
                  {m}
                </div>
              ))}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
