import React, { useState } from "react";
import PropTypes from 'prop-types';
import "./settings.css";
import { User, Moon, Eye, Shield, HelpCircleIcon, LogOut } from "lucide-react";
import ChangeUserName from "../UserNameDialogue/ChangeUserName";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Setting = ({randomName, token}) => {
  const VITE_BASE_URL =  "http://localhost:3000";
  const [isDialogOpen, setDialogOpen] = useState(false);
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
      <button className="settings-button">
        <Moon className="settings-icons" />
        <div className="text-sm">Theme</div>
      </button>
      <button className="settings-button">
        <Eye className="settings-icons" />
        <div className="text-sm">Privacy</div>
      </button>
      <button className="settings-button">
        <Shield className="settings-icons" />
        <div className="text-sm">Security</div>
      </button>
      <button className="settings-button">
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
    </div>
  );
}
Setting.propTypes = {
  randomName: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired
};
export default Setting;
