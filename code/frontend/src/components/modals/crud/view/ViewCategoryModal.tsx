import { useState } from "react";
import Modal from "../../../ui/Modal";
import ConfirmModal from "../../alert/ConfirmModal";

type Category = {
  id: number;
  tscName: string;
  tscDescription?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const ViewCategoryModal: React.FC<Props> = ({ isOpen, onClose, onEdit, onDelete, category }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!category) return null;

  const handleDelete = () => {
    onDelete(category);
    setShowConfirm(false);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Category Details">
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-slate-500 uppercase tracking-wide text-xs">Name</p>
            <p className="font-medium">{category.tscName}</p>
          </div>

          <div>
            <p className="text-slate-500 uppercase tracking-wide text-xs">Description</p>
            <p>{category.tscDescription || "—"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-500 uppercase tracking-wide text-xs">Created</p>
              <p>{category.createdAt ? new Date(category.createdAt).toLocaleString() : "—"}</p>
            </div>
            <div>
              <p className="text-slate-500 uppercase tracking-wide text-xs">Updated</p>
              <p>{category.updatedAt ? new Date(category.updatedAt).toLocaleString() : "—"}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <button
              className="flex-1 border border-slate-300 rounded-md py-2"
              onClick={() => onEdit(category)}
            >
              Edit
            </button>
            <button
              className="flex-1 bg-red-600 text-white rounded-md py-2"
              onClick={() => setShowConfirm(true)}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={showConfirm}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};

export default ViewCategoryModal;
