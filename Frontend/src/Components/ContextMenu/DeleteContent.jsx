import React from "react";
import axios from "axios";
import { io } from "socket.io-client";
import PropTypes from "prop-types";
const DeleteContent = ({ messageId, onDelete }) => {
  const VITE_BASE_URL =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_BASE_URL_DEV
      : import.meta.env.VITE_BASE_URL;
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
      socket.emit("deleteMessage", messageId);
      console.log(`Message ${messageId} deleted`);
      onDelete();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };
  return (
    <div className="h-screen w-screen fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-brightness-55">
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ] rounded-lg 
       bg-[var(--color-input-bg)] flex flex-col justify-between items-center"
      >
        <div className="w-100 flex flex-col bg-[#161b21] justify-center p-4 rounded-t-lg ">
          <h2 className="w-full text-lg font-semibold mb-2 text-white">
            Delete Message
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            Are you sure you want to delete this message?
          </p>
        </div>
        <div className="w-100 flex justify-between mt-3 p-4 gap-4">
          <button className="submit-button !text-xs" onClick={() => onDelete()}>
            Cancel
          </button>
          <button className="submit-button !text-xs" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteContent.propTypes = {
  messageId: PropTypes.string.isRequired,
};
export default DeleteContent;
