import { X } from "lucide-react";

export default function ImageModal({ image, onClose }) {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-10 backdrop-brightness-20 z-50"
      onClick={onClose}
    >
      <div
        className="relative p-4 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-6 right-6 text-xs p-0.5 bg-[var(--color-input-bg)] border-b border-r border-[var(--color-input-border)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] opacity-80 !text-[var(--color-text-tertiary)] rounded-full hover:scale-105 active:scale-95 active:brightness-150"
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
