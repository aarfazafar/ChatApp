import React from 'react'
import "./LandingPage.css"
import { Ghost } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
const LandingPage = () => {
  const VITE_BASE_URL = "http://localhost:5173"
  const navigate = useNavigate();
  return (
    <div className='vtFont flex'>
      <div className="left  w-[50%] h-[100vh]">
        <h1 className='text-8xl font-bold pl-[5vw] mt-[32vh] text-[var(--color-accent)]'>Shadow Speaks Here</h1>
        <p className='text-2xl pl-[5vw] text-[var(--color-accent)]'>&quot;Speak without a face. Vanish without a trace&quot;</p>
        <button onClick={(e) => {
          e.preventDefault();
          window.location.href = "/register"
        }} className='testing w-[80%] h-[8vh]'>Join the Shadows</button>
      </div>
      <div className="right w-[50%] h-fit mt-[8vw] flex justify-center items-center landing-animation">
        <Ghost className='h-[70vh] w-[70vh]' color='#4fff4f'/>
      </div>
    </div>
  )
}

export default LandingPage
