import React from 'react'
import "./LandingPage.css"
import { Ghost } from 'lucide-react'
const LandingPage = () => {
  return (
    <div className='vtFont flex flex-col-reverse gap-4 lg:flex-row lg:gap-0 items-center justify-center min-h-screen px-6 md:px-12 lg:px-20 overflow-hidden'>
      <div className="left w-full md:w-2/3 text-center md:text-left">
        <h1 className='text-6xl lg:text-8xl font-bold text-[var(--color-accent)] md:ml-17 tracking-wider md:tracking-normal'>Shadow Speaks Here</h1>
        <p className='text-xl md:text-2xl mt-4 text-[var(--color-accent)] md:ml-17'>&quot;Speak without a face. Vanish without a trace&quot;</p>
        <button onClick={(e) => {
          e.preventDefault();
          window.location.href = "/register"
        }} className='testing w-full md:w-[80%] h-[50px] md:h-[8vh] md:mt-6 rounded-lg text-lg font-semibold tracking-wide'>Join the Shadows</button>
      </div>
      <div className="right w-full flex lg:block md:w-1/2 md:m-0 justify-center items-center landing-animation mt-10 md:mt-0">
        <Ghost className='h-[32vh] md:h-[50vh] lg:h-[70vh] w-auto' color='#4fff4f'/>
      </div>
    </div>
  )
}

export default LandingPage
