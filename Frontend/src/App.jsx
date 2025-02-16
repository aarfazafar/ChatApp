import { Route, Routes } from 'react-router-dom'
import './App.css'
import { useEffect, useState } from 'react';
import Loader from './Components/Loader/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './Components/LandingPage/LandingPage';
import Register from './Components/Auth/Register';
import Home from './Components/Home/Home';
import Chat from './Components/Chat'
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1600); 
  }, []);
  
  return (
    <div className="bg-[var(--color-dark-primary)] min-h-screen"> {/* Ensure no white background */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }} 
            className="fixed inset-0 flex items-center justify-center bg-black" // Force background
          >
            <Loader />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Routes>
              <Route path='/' element={<LandingPage/>}/>
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Home/>} />
              <Route path="/chat" element={<Chat/>} />
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

// --color-green-50: oklch(0.982 0.018 155.826);
// --color-green-100: oklch(0.962 0.044 156.743);
// --color-green-200: oklch(0.925 0.084 155.995);
// --color-green-300: oklch(0.871 0.15 154.449);
// --color-green-400: oklch(0.792 0.209 151.711);
// --color-green-500: oklch(0.723 0.219 149.579);
// --color-green-600: oklch(0.627 0.194 149.214);
// --color-green-700: oklch(0.527 0.154 150.069);
// --color-green-800: oklch(0.448 0.119 151.328);
// --color-green-900: oklch(0.393 0.095 152.535);
// --color-green-950: oklch(0.266 0.065 152.934);
