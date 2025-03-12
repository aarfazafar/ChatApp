import React, { useState } from "react";
import PropTypes from "prop-types";
import "./settings.css";
import { User, Moon, Eye, Shield, HelpCircleIcon, LogOut } from "lucide-react";
import ChangeUserName from "../UserNameDialogue/ChangeUserName";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ComingSoon from "./ComingSoon";
const Setting = ({ onClose, randomName, token }) => {
  const VITE_BASE_URL =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_BASE_URL_DEV
      : import.meta.env.VITE_BASE_URL;
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isThemeOpen, setThemeOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async (e) => {
    e.preventDefault();
    await axios
      .get(`${VITE_BASE_URL}/user/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        localStorage.removeItem("authToken");
        // console.log(res);
        console.log("Logout Successful");
        navigate("/register");
      });
  };
  const handleChangeUserName = () => {
    setDialogOpen(true);
  };
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 w-[100vw] flex items-center justify-center bg-transparent z-50"
    >
      <div
        className={`fixed top-19 right-4 min-w-3xs p-4 bg-[#0d1117] rounded-lg space-y-3 z-10 shadow-[0_10px_50px_rgba(0,0,0,0.5)]
`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="settings-button" onClick={handleChangeUserName}>
          <User className="settings-icons" />
          <div className="text-sm">Change Username</div>
        </button>
        <button className="settings-button" onClick={() => setThemeOpen(true)}>
          <Moon className="settings-icons" />
          <div className="text-sm">Theme</div>
        </button>
        <button className="settings-button" onClick={() => setThemeOpen(true)}>
          <Eye className="settings-icons" />
          <div className="text-sm">Privacy</div>
        </button>
        <button className="settings-button" onClick={() => setThemeOpen(true)}>
          <Shield className="settings-icons" />
          <div className="text-sm">Security</div>
        </button>
        <button className="settings-button" onClick={() => setThemeOpen(true)}>
          <HelpCircleIcon className="settings-icons" />
          <div className="text-sm">Help</div>
        </button>
        <button onClick={handleLogout} className="settings-button">
          <LogOut className="settings-icons" />
          <div className="text-sm">LogOut</div>
        </button>
        <ChangeUserName
          randomName={randomName}
          isOpen={isDialogOpen}
          onClose={() => setDialogOpen(false)}
        />
        <ComingSoon isOpen={isThemeOpen} onClose={() => setThemeOpen(false)} />
      </div>
    </div>
  );
};
Setting.propTypes = {
  randomName: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};
export default Setting;
