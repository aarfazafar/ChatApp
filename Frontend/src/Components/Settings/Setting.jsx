import React, { useState } from "react";
import PropTypes from 'prop-types';
import "./settings.css";
import { User, Moon, Eye, Shield, HelpCircleIcon, LogOut } from "lucide-react";
import ChangeUserName from "../UserNameDialogue/ChangeUserName";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ComingSoon from "./ComingSoon";
const Setting = ({randomName, token}) => {
  const VITE_BASE_URL =  "http://localhost:3000";
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isThemeOpen, setThemeOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async (e) => {
    e.preventDefault();
    await axios.get(`${VITE_BASE_URL}/user/logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true
    }).then((res) => {
      localStorage.removeItem("authToken");
      // console.log(res);
      console.log("Logout Successful");
      navigate("/register");
    })
  }
  const handleChangeUserName = () => {
    setDialogOpen(true);
  };
  return (
    <div className={`fixed right-2 min-w-3xs mt-4 p-4 bg-[#0a0f1e] rounded-lg border border-[#2a3347] space-y-3 z-10`}>
      <button className="settings-button" onClick={handleChangeUserName}>
        <User className="settings-icons" />
        <div className="text-sm">Change Username</div>
      </button>
      <button className="settings-button" onClick={()=>setThemeOpen(true)}>
        <Moon className="settings-icons" />
        <div className="text-sm">Theme</div>
      </button>
      <button className="settings-button" onClick={()=>setThemeOpen(true)}>
        <Eye className="settings-icons" />
        <div className="text-sm">Privacy</div>
      </button>
      <button className="settings-button" onClick={()=>setThemeOpen(true)}>
        <Shield className="settings-icons" />
        <div className="text-sm">Security</div>
      </button>
      <button className="settings-button" onClick={()=>setThemeOpen(true)}>
        <HelpCircleIcon className="settings-icons" />
        <div className="text-sm">Help</div>
      </button>
      <button onClick={handleLogout} className="settings-button">
        <LogOut className="settings-icons"/>
        <div className="text-sm">LogOut</div>
      </button>
      <ChangeUserName randomName={randomName}
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
      />
      <ComingSoon
        isOpen={isThemeOpen}
        onClose={() => setThemeOpen(false)}
      />
    </div>
  );
}
Setting.propTypes = {
  randomName: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired
};
export default Setting;
