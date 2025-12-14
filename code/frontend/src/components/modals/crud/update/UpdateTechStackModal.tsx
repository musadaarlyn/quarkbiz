import { useEffect, useState } from "react";
import Modal from "../../../ui/Modal";
import { fetchCategories } from "../../../../services/CategoriesService";

type Category = {
  id: number;
  tscName: string;
};

interface Props {
  isOpen: boolean;
  stack: { id: number; tsName: string; tsDescription?: string | null; categoryId?: number } | null;
  onClose: () => void;
  onSubmit: (id: number, name: string, description?: string, category?: number) => void;
  categoryRefreshKey: number;
}

const UpdateTechStackModal: React.FC<Props> = ({ isOpen, stack, onClose, onSubmit, categoryRefreshKey }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [errors, setErrors] = useState<{ name?: string; categoryId?: string }>({});

  // Load categories
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

  // Load stack details
  useEffect(() => {
    if (stack) {
      setName(stack.tsName);
      setDescription(stack.tsDescription ?? "");
      setCategoryId(stack.categoryId ?? 0);
      setErrors({});
    }
  }, [stack]);

  const handleSave = () => {
    if (!stack) return;

    const newErrors: { name?: string; categoryId?: string } = {};
    if (!name.trim()) newErrors.name = "Tech stack name is required";
    if (categoryId === 0) newErrors.categoryId = "Please select a category";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(stack.id, name, description, categoryId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Tech Stack">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Tech Stack Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
          }}
          className={`w-full px-3 py-2 rounded-md border ${
            errors.name ? "border-red-500" : "border-slate-300"
          }`}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}

        <textarea
          placeholder="Description"
          className="w-full border rounded-md px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

        {isLoading ? (
          <p className="text-sm text-slate-500">Loading categories…</p>
        ) : (
          <>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(Number(e.target.value));
                if (errors.categoryId) setErrors(prev => ({ ...prev, categoryId: undefined }));
              }}
              className={`w-full px-3 py-2 rounded-md border ${
                errors.categoryId ? "border-red-500" : "border-slate-300"
              }`}
            >
              <option value={0}>Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.tscName}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-sm text-red-500 mt-1">{errors.categoryId}</p>}
          </>
        )}

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

export default UpdateTechStackModal;
