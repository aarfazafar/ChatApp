import React, { useState, useEffect } from "react";
import './changeuser.css'
const ChangeUserName = ({ randomName, isOpen, onClose }) => {

 
  const [username, setUsername] = useState(randomName);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
            onClick={() => setIsEditing(!isEditing)}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="submit-button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeUserName;
