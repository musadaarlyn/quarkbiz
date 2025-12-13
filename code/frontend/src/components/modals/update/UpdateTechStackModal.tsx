import { useEffect, useState } from "react";
import Modal from "../../ui/Modal";
import { fetchCategories } from "../../../services/CategoriesService";

type Category = {
  id: number;
  tscName: string;
};

interface Props {
  isOpen: boolean;
  stack: { id: number; tsName: string; tsDescription?: string | null; categoryId?: number } | null;
  onClose: () => void;
  onSubmit: (id: number, name: string, description?: string, category?: number) => void;
}

const UpdateTechStackModal: React.FC<Props> = ({ isOpen, stack, onClose, onSubmit }) => {

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(0);

  // load categories dropdown
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

  // load tech stack deets
  useEffect(() => {
    if (stack) {
      setName(stack.tsName);
      setDescription(stack.tsDescription ?? "");
      setCategory(stack.categoryId??0);
    }
  }, [stack]);

  // save changes
  const handleSave = () => {
    if (!stack || !name.trim()) return;
    onSubmit(stack.id, name, description, category);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit category">
      <div className="space-y-4">
        <input className="w-full border rounded-md px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea className="w-full border rounded-md px-3 py-2" value={description} onChange={(e) => setDescription(e.target.value)} />
            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
            {isLoading ? (
                <p className="text-sm text-slate-500">Loading categories…</p>
            ) : (
        <select
            className="w-full border rounded-md px-3 py-2"
            value={category}
            onChange={(e) => setCategory(Number(e.target.value))}
            >
            <option value="">Select category</option>
            {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                {cat.tscName}
                </option>
            ))}
        </select>
        )}
        <button className="w-full bg-blue-600 text-white py-2 rounded-md" onClick={handleSave}>Save changes</button>
      </div>
    </Modal>
  );
};

export default UpdateTechStackModal;