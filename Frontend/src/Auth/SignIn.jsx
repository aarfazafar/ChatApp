import React, { useState } from "react";
import { Ghost, EyeOff, Mail, Eye } from "lucide-react";
import "./auth.css";

import axios from 'axios'
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const VITE_BASE_URL =  "http://localhost:3000"

  const handleSubmit =  async(e) => {
    e.preventDefault()
    const existingUser = {
      email: email,
      password: password
    }

    try {
      const response = await axios.post(`${VITE_BASE_URL}/user/login`, existingUser);
      console.log(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Invalid Credentials";
      console.error("Error:", errorMessage);
    }
  };

  const handlePasswordShow = () => {
    setShowPassword((showPassword) => !showPassword);
  };
  return (
    <div className="min-h-screen bg-[var(--color-dark-primary)] flex items-center justify-center">
      <div className="w-full max-w-md bg-[var(--color-dark-secondary)] p-10 rounded-2xl shadow-2xl opacity-80">
        <div className="flex items-center justify-center mb-8 scale-animation">
          <Ghost className="w-12 h-12 scale-x-120 text-[var(--color-accent)]" />
        </div>
        <h1 className="text-4xl font-bold text-center mb-3 text-[var(--color-text-tertiary)] glitch-text">
          PHANTOM CHAT
        </h1>
        <p className="text-[var(--color-text-secondary)] text-center mb-8">
          Hey Wanderer! Welcome back to the shadows
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-4 text-white">
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className={`form-label ${
                  focusedField === "email" ? "text-[var(--color-accent)]" : ""
                }`}
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 z-1  -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input-field pl-10"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e)=> {setEmail(e.target.value)}}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="password"
                className={`form-label ${
                  focusedField === "password"
                    ? "text-[var(--color-accent)]"
                    : ""
                }`}
              >
                Password
              </label>
              <div className="relative">
                {!showPassword ? (
                  <EyeOff
                    className="absolute left-3 top-1/2 z-1  -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]"
                    onClick={handlePasswordShow}
                  />
                ) : (
                  <Eye
                    className="absolute left-3 top-1/2 z-1  -translate-y-1/2 w-5 h-5 text-[var(--color-accent)]"
                    onClick={handlePasswordShow}
                  />
                )}

                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="input-field pl-10"
                  placeholder="Whisper your secret key"
                  value={password}
                  onChange={(e)=> {setPassword(e.target.value)}}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="submit-button group">
              <span className="group-hover:animate-pulse">
                Enter the PlayGround
              </span>
            </button>
          </div>
          <div className="pt-4">
            <p className="text-[var(--color-text-tertiary)] text-sm text-center mt-2 cursor-pointer">
              Forgotten your way?{" "}
              <span className="text-green-400  hover:text-green-600">Recover your soul here</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignIn;
