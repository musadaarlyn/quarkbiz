import React from "react";

interface CardProps {
  title: string;
  description?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, description, onClick }) => {
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

      {description && (
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      )}
    </div>
  );
};

export default Card;
