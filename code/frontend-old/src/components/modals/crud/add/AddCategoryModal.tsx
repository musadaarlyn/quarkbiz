import { use, useState } from "react";
import Modal from "../../../ui/Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => void;
}

const AddCategoryModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
  }>({});


  const handleSubmit = () => {
    const newErrors: { name?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Category name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(name, description);
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Category">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) {
              setErrors((prev) => ({ ...prev, name: undefined }));
            }
          }}
          className={`w-full rounded-md px-3 py-2 border ${
            errors.name ? "border-red-500" : "border-slate-300"
          }`}
        />

        {errors.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}


        <textarea
          placeholder="Description"
          className="w-full border rounded-md px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Add Category
        </button>
      </div>

    </Modal>
  );
};

export default AddCategoryModal;
