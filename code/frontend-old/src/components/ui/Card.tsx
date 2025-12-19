import React from "react";

interface CardProps {
  title: string;
  onClick?: () => void;
  className?: string;
  titleClassName?: string;
  style?: React.CSSProperties;
  id?: string; 
}

const Card: React.FC<CardProps> = ({ 
  title, 
  onClick, 
  className = "",
  titleClassName = "",
  style,
  id }) => {
  return (
    <div
      id={id}
      onClick={onClick}
      style={style}
      className={`w-48 h-32 rounded-xl border border-gray-200 
                bg-white p-4 flex flex-col justify-center cursor-pointer 
                transition shadow-sm hover:shadow-md hover:border-gray-300 
            ${className}`
      }
    >
      <h3 className={`text-lg font-semibold text-gray-900 ${titleClassName}`}>{title}</h3>

    </div>
  );
};

export default Card;
