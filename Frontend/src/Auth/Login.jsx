import { useContext, useState } from "react";
import {
  Ghost,
  EyeOff,
  User,
  Mail,
  Calendar,
  Eye,
} from "lucide-react";
import "./auth.css";
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import UserContext, { UserDataContext } from "./userContext";
const Login = () => {
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ age, setAge ] = useState()
  const [ userData, setUserData ] = useState({})

  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const VITE_BASE_URL =  "http://localhost:3000"

  const { user, setUser } = useContext(UserDataContext)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      name: {
        first: firstName,
        last: lastName
      },
      email: email,
      password: password,
      age: age
    };


    const response = await axios.post(`${VITE_BASE_URL}/user/register`, newUser)

    try{
      const data = response.data
      setUser(data.user)
      console.log("User created ",data.user)
      localStorage.setItem('token', data.token)
      navigate('/')
    } catch(err){
      console.log(err.message)
    }

    // setFormData({
    //     firstName: "",
    //     lastName: "",
    //     email: "",
    //     password: "",
    //     age: "",
      
    // })
  };




  const handlePasswordShow = () => {
    setShowPassword((showPassword) => !showPassword);
  };
  return (
    <div className="min-h-screen bg-[var(--color-dark-primary)] flex items-center justify-center">
      <div className="w-full max-w-md bg-[var(--color-dark-secondary)] p-8 rounded-2xl shadow-2xl opacity-80">
        <div className="flex items-center justify-center mb-8 scale-animation">
          <Ghost className="w-12 h-12 scale-x-120 text-[var(--color-accent)]" />
        </div>
        <h1 className="text-4xl font-bold text-center mb-1 text-[var(--color-text-primary)] glitch-text">
          PHANTOM CHAT
        </h1>
        <p className="text-[var(--color-text-secondary)] text-center mb-8">
          Speak, but remain unseen.🕵️‍♂️
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-4 text-white">
            <div className="flex gap-2">
              <div className="flex flex-col">
                <label
                  htmlFor="firstName"
                  className={`form-label ${
                    focusedField === "firstName"
                      ? "text-[var(--color-accent)]"
                      : ""
                  }`}
                >
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 z-1 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="input-field pl-10"
                    placeholder="First"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                    onFocus={() => setFocusedField("firstName")}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="lastName"
                  className={`form-label ${
                    focusedField === "lastName"
                      ? "text-[var(--color-accent)]"
                      : ""
                  }`}
                >
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 z-1 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="input-field pl-10"
                    placeholder="Last"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                    onFocus={() => setFocusedField("lastName")}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                </div>
              </div>
            </div>

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
                  placeholder="Even ghosts need mail…"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
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
                  placeholder="A secret only the dark knows…"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="age"
                className={`form-label ${
                  focusedField === "age" ? "text-[var(--color-accent)]" : ""
                }`}
              >
                Age
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 z-1  -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                <input
                  type="number"
                  id="age"
                  name="age"
                  className="input-field pl-10"
                  placeholder="Why?? No one knows..😶‍🌫️"
                  min="0"
                  max="150"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                  }}
                  onFocus={() => setFocusedField("age")}
                  onBlur={() => setFocusedField(null)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="submit-button group">
              <span className="group-hover:animate-pulse">Step into the shadows</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
