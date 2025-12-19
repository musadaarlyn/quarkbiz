import React from "react";
import { Plus } from "lucide-react";

interface AddCardProps {
  onClick?: () => void;
}

const AddCard: React.FC<AddCardProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        w-48 h-32 rounded-xl border-2 border-dashed border-gray-300
        flex flex-col items-center justify-center cursor-pointer
        hover:bg-gray-50 hover:border-gray-400 transition
      `}
    >
      <Plus size={28} className="text-gray-500" />
      <span className="mt-2 text-sm text-gray-600 font-medium">Add</span>
    </div>
  );
};

export default AddCard;
