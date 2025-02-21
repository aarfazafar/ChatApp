import React from "react";
import axios from "axios";
import { io } from "socket.io-client";
const DeleteContent = ({ messageId }) => {
  const VITE_BASE_URL = "http://localhost:3000";
  const socket = io(VITE_BASE_URL);
  const handleDelete = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    try {
      await axios.post(
        `${VITE_BASE_URL}/messages/delete-message`,
        { id: messageId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // socket.emit("delete-message", messageId);
      console.log(`Message ${messageId} deleted`);
      // onClose();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 text-red-600">Delete Item?</h2>
      <p className="mt-2 mb-4">Are you sure you want to delete this message?</p>
      <div className="flex justify-center gap-30 mt-3">
        <button className="submit-button" onClick={() => alert("cancelled")}>
          Cancel
        </button>
        <button className="submit-button" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteContent;
