import React from "react";

interface CardProps {
  title: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        w-48 h-32 bg-white rounded-xl shadow-sm border border-gray-200
        p-4 flex flex-col justify-between cursor-pointer transition
        hover:shadow-md hover:border-gray-300
      `}
    >
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

    </div>
  );
};

export default Card;
