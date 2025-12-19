import React from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        {/* Form or Content */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
