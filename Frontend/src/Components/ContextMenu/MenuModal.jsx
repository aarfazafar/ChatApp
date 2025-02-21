import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
// import { Cross } from "lucide-react";
const MenuModal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-transparent"
    style={{
      backgroundImage: `
    radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%), 
    linear-gradient(to bottom, rgba(13, 17, 23, 0.7), rgba(22, 27, 34, 0.7))
  `,
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        // className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
         className="bg-[#0a0f1e] p-8 rounded-lg shadow-lg border border-[#2a3347]  max-w-sm w-full text-white relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-[var(--color-accent)]"
          
        >
          ✖
        </button>
        {children}
      </motion.div>
    </div>
  );
};

export default MenuModal;
