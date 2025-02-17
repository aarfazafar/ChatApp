import React, { useState } from "react";
import "./settings.css";
import { User, Moon, Eye, Shield, HelpCircleIcon } from "lucide-react";
import ChangeUserName from "../UserNameDialogue/ChangeUserName";

const Setting = ({randomName}) => {

  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleChangeUserName = () => {
    setDialogOpen(true);
  };
  return (
    <div className="mt-4 p-4 bg-[#0a0f1e] rounded-lg border border-[#2a3347] space-y-3">
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
      <ChangeUserName randomName={randomName}
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
};
export default Setting;
