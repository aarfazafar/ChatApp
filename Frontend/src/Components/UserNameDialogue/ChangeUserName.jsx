import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./changeuser.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const ChangeUserName = ({ randomName, isOpen, onClose }) => {
  const VITE_BASE_URL = import.meta.env.MODE === "development"
  ? import.meta.env.VITE_BASE_URL_DEV
  : import.meta.env.VITE_BASE_URL;
  const [username, setUsername] = useState(randomName);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  async function updateUsername(newUsername) {
    try {
      const token = localStorage.getItem("authToken");

      const res = await axios.put(
        `${VITE_BASE_URL}/user/change-username`,
        { newUsername },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleChangeUsername = async () => {
    if (!username.trim()) {
      alert("Username cannot be empty!");
      return;
    }
    await updateUsername(username);
    window.location.reload(true);
    setIsEditing(false);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 h-full w-full backdrop-blur-md bg-transparent"
      style={{
        backgroundImage: `
      radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%), 
      linear-gradient(to bottom, rgba(13, 17, 23, 0.7), rgba(22, 27, 34, 0.7))
    `,
      }}
    >
      <div className="bg-[#0a0f1e] p-6 rounded-lg shadow-lg border border-[#2a3347] w-80 text-white relative">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Change Username
        </h2>

        <div className="flex items-center justify-between border rounded px-3 py-2">
          {isEditing ? (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-transparent outline-none text-white w-full"
            />
          ) : (
            <span>{username}</span>
          )}

          <button
            onClick={() => {
              if (isEditing) {
                handleChangeUsername();
              } else {
                setIsEditing(true);
              }
            }}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="submit-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ChangeUserName.propTypes = {
  randomName: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChangeUserName;
