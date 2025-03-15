import { Info, Edit, Trash } from "lucide-react";
import "../Settings/settings.css";
import { useState } from "react";
import PropTypes from "prop-types";
import EditContent from "./EditContent";
import DeleteContent from "./DeleteContent";
import InfoContent from "./InfoContent";
import MenuModal from "./MenuModal";
const ContextMenu = ({ messageId, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = (type) => {
    setIsModalOpen(true);
    switch (type) {
      case "edit":
        setModalContent(<EditContent messageId={{ messageId }} />);
        break;
      case "delete":
        setModalContent(<DeleteContent messageId={{ messageId }} />);
        break;
      case "info":
        setModalContent(<InfoContent />);
        break;
      default:
        setModalContent(null);
    }
  };

  return (
    <>
      <div
        className={`z-20 w-35 px-2 py-3 rounded-md bg-[#161e26] text-neutral-300 flex-col`}
      >
        <button
          className="settings-button mb-1"
          onClick={() => openModal("info")}
        >
          <Info className="settings-icons" />
          <div>Info</div>
        </button>
        <button
          className="settings-button mb-1"
          onClick={() => openModal("edit")}
        >
          <Edit className="settings-icons" />
          <div>Edit</div>
        </button>
        <button
          className="settings-button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash className="settings-icons" />
          <div>Delete</div>
        </button>
      </div>

      <MenuModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent}
      </MenuModal>
    </>
  );
};
ContextMenu.propTypes = {
  messageId: PropTypes.string.isRequired,
};

export default ContextMenu;
