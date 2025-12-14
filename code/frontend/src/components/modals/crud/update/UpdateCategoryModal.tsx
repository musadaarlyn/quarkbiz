import { useEffect, useState } from "react";
import Modal from "../../../ui/Modal";

interface Props {
  isOpen: boolean;
  category: { id: number; tscName: string; tscDescription?: string | null } | null;
  onClose: () => void;
  onSubmit: (id: number, name: string, description?: string) => void;
}

const UpdateCategoryModal: React.FC<Props> = ({ isOpen, category, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (category) {
      setName(category.tscName);
      setDescription(category.tscDescription ?? "");
      setErrors({});
    }
  }, [category]);

  const handleSave = () => {
    if (!category) return;

    const newErrors: { name?: string } = {};
    if (!name.trim()) {
      newErrors.name = "Category name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(category.id, name, description);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Category">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          className={`w-full rounded-md px-3 py-2 border ${
            errors.name ? "border-red-500" : "border-slate-300"
          }`}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

        <textarea
          placeholder="Description"
          className="w-full border rounded-md px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Save changes
        </button>
      </div>
    </Modal>
  );
};

export default UpdateCategoryModal;
