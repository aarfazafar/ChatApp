import React, {useEffect} from "react";
import PropTypes from "prop-types";
import "../UserNameDialogue/changeuser.css";

const ComingSoon = ({isOpen, onClose }) => {
 
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 h-full w-full backdrop-brightness-75 bg-transparent"
      style={{
        backgroundImage: `
      radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%), 
      linear-gradient(to bottom, rgba(13, 17, 23, 0.7), rgba(22, 27, 34, 0.7))
    `,
      }}
    >
      <div className="bg-[#0a0f1e] p-6 rounded-lg shadow-lg border border-[#2a3347] w-80 text-white relative">
        <h2 className="text-xl font-semibold mb-4 text-center">
         COMING SOON...
        </h2>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="submit-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ComingSoon.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ComingSoon;
