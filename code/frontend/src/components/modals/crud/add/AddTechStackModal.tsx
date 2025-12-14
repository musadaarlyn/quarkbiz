import { useEffect, useState } from "react";
import Modal from "../../../ui/Modal";
import { fetchCategories } from "../../../../services/CategoriesService";

type Category = {
  id: number;
  tscName: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string, categoryId: number) => void;
  categoryRefreshKey: number; 
}

const AddTechStackModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, categoryRefreshKey }) => {

  const [errors, setErrors] = useState<{
    name?: string;
    categoryId?: string;
  }>({});

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(0);

  useEffect(() => {
      const load = async () => {
        try {
          setLoading(true);
          setCategories(await fetchCategories());
          setError(null);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };
      load();
    }, [isOpen, categoryRefreshKey]);

  const handleSubmit = () => {
    const newErrors: {
      name?: string;
      categoryId?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = "Tech stack name is required";
    }

    if (categoryId === 0) {
      newErrors.categoryId = "Please select a category";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    onSubmit(name, description, categoryId);
    setName("");
    setDescription("");
    setCategoryId(0);
    onClose();
  };

  // Return ----------------------------------------------------------
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Technology Stack">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Tech Stack Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) {
              setErrors(prev => ({ ...prev, name: undefined }));
            }
          }}
          className={`w-full px-3 py-2 rounded-md border ${
            errors.name ? "border-red-500" : "border-slate-300"
          }`}
        />

        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name}</p>
        )}


        <textarea
          placeholder="Description"
          className="w-full border rounded-md px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {error && (
          <p className="text-sm text-red-500 mb-2">{error}</p>
        )}

        {isLoading ? (
          <p className="text-sm text-slate-500">Loading categories…</p>
        ) : (
          <>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(Number(e.target.value));
                if (errors.categoryId) {
                  setErrors(prev => ({ ...prev, categoryId: undefined }));
                }
              }}
              className={`w-full px-3 py-2 rounded-md border ${
                errors.categoryId ? "border-red-500" : "border-slate-300"
              }`}
            >
              <option value={0}>Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.tscName}
                </option>
              ))}
            </select>

            {errors.categoryId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.categoryId}
              </p>
            )}
          </>
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Add Tech Stack
        </button>
      </div>
    </Modal>
  );
};

export default AddTechStackModal;