import { X } from "lucide-react";

export default function ImageModal({ image, onClose }) {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-10 backdrop-blur-md z-50"
      onClick={onClose}
    >
      <div
        className="relative p-4 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-6 right-6 !text-black hover:text-white"
          onClick={onClose}
        >
          <X size={30} />
        </button>
        <img
          src={image}
          alt="Preview"
          className="max-w-[80vw] max-h-[80vh] rounded-lg"
        />
      </div>
    </div>
  );
}
