import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const Loader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => (prev < 100 ? prev + 1 : 100));
    }, 15);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count === 100) {
      setTimeout(() => {
        setLoadingComplete(true);
        if (onComplete) onComplete(); 
      }, 20);
    }
  }, [count, onComplete]);

  return (
    <AnimatePresence>
      {!loadingComplete && (
        <motion.div
          className="flex flex-col items-center justify-center h-screen bg-[var(--color-dark-primary)] text-white fixed inset-0 z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-6xl font-bold"
            animate={{ opacity: [0.5, 1], scale: [0.9, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          >
            {count}%
          </motion.h1>
          <div className="w-64 h-3 mt-4 bg-gray-700 rounded-full">
            <motion.div
              className="h-3 bg-green-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${count}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
Loader.propTypes = {
  onComplete: PropTypes.func,
};

export default Loader;
