import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        px-4 py-2
        bg-blue-600 text-white
        rounded-lg
        hover:bg-blue-700
        transition
      "
    >
      {children}
    </button>
  );
}
