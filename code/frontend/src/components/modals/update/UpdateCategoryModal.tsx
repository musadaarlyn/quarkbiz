import { useEffect, useState } from "react";
import Modal from "../../ui/Modal";

interface Props {
  isOpen: boolean;
  category: { id: number; tscName: string; tscDescription?: string | null } | null;
  onClose: () => void;
  onSubmit: (id: number, name: string, description?: string) => void;
}

const UpdateCategoryModal: React.FC<Props> = ({ isOpen, category, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.tscName);
      setDescription(category.tscDescription ?? "");
    }
  }, [category]);

  const handleSave = () => {
    if (!category || !name.trim()) return;
    onSubmit(category.id, name, description);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit category">
      <div className="space-y-4">
        <input className="w-full border rounded-md px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea className="w-full border rounded-md px-3 py-2" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button className="w-full bg-blue-600 text-white py-2 rounded-md" onClick={handleSave}>Save changes</button>
      </div>
    </Modal>
  );
};

export default UpdateCategoryModal;