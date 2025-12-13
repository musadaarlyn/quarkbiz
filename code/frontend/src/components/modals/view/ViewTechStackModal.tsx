import Modal from "../../ui/Modal";

type Category = {
  id: number;
  tscName: string;
};


type Stack = {
  id: number;
  tsName: string;
  tsDescription?: string | null;
  categoryId: number;
  createdAt?: string | null;
  updatedAt?: string | null;
};


interface Props {
  isOpen: boolean;
  onClose: () => void;
  stack?: Stack | null;
  category?: Category | null;
  onEdit: (stack: Stack) => void;
  onDelete: (stack: Stack) => void;
}

const ViewTechStackModal: React.FC<Props> = ({ isOpen, onClose, onEdit, onDelete,category, stack: stack  }) => {
  if (!stack) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Category details">
      <div className="space-y-3 text-sm">
        <div>
          <p className="text-slate-500 uppercase tracking-wide text-xs">Name</p>
          <p className="font-medium">{stack.tsName}</p>
        </div>

        <div>
          <p className="text-slate-500 uppercase tracking-wide text-xs">Description</p>
          <p>{stack.tsDescription || "—"}</p>
        </div>

        <div>
          <p className="text-slate-500 uppercase tracking-wide text-xs">Category</p>
          <p>{category?.tscName || "—"}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-slate-500 uppercase tracking-wide text-xs">Created</p>
            <p>{stack.createdAt ? new Date(stack.createdAt).toLocaleString() : "—"}</p>
          </div>
          <div>
            <p className="text-slate-500 uppercase tracking-wide text-xs">Updated</p>
            <p>{stack.updatedAt ? new Date(stack.updatedAt).toLocaleString() : "—"}</p>
          </div>
        </div>

        <div className="flex gap-3 pt-6">
        <button className="flex-1 border border-slate-300 rounded-md py-2" onClick={() => stack && onEdit(stack)}>
            Edit
        </button>
        <button className="flex-1 bg-red-600 text-white rounded-md py-2" onClick={() => stack && onDelete(stack)}>
            Delete
        </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewTechStackModal;