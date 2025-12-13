import { useEffect, useState } from "react";
import Modal from "../../ui/Modal";
import { fetchCategories } from "../../../services/CategoriesService";

type Category = {
  id: number;
  tscName: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string, categoryId: number) => void;
}

const AddTechStackModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {

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
    }, []);

  const handleSubmit = () => {
    if (!name.trim()) return;
    if(!description.trim()) return;
    onSubmit(name, description, categoryId);
    setName("");
    setDescription("");
    setCategoryId(0);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Technology Stack">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Tech Stack Name"
          className="w-full border rounded-md px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full border rounded-md px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
            {isLoading ? (
                <p className="text-sm text-slate-500">Loading categories…</p>
            ) : (
        <select
            className="w-full border rounded-md px-3 py-2"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            >
            <option value="">Select category</option>
            {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                {cat.tscName}
                </option>
            ))}
        </select>
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