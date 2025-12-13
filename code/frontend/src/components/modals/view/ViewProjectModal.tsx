import Modal from "../../ui/Modal";

type Project = {
  id: number;
  projName: string;
  projDescription?: string | null;
  techStackIds: number[];
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  getTechStackNames: (ids: number[]) => string[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

const ViewProjectModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete,
  getTechStackNames,
  project 
}) => {
  if (!project) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Project details">
      <div className="space-y-3 text-sm">
        <div>
          <p className="text-slate-500 uppercase tracking-wide text-xs">Name</p>
          <p className="font-medium">{project.projName}</p>
        </div>

        <div>
          <p className="text-slate-500 uppercase tracking-wide text-xs">Status</p>
          <p>{project.status}</p>
        </div>

        <div>
          <p className="text-slate-500 uppercase tracking-wide text-xs">Description</p>
          <p>{project.projDescription || "—"}</p>
        </div>

        <div>
          <p className="text-slate-500 uppercase tracking-wide text-xs">Tech Stack</p>
          <p>
            {project.techStackIds && project.techStackIds.length > 0 
              ? getTechStackNames(project.techStackIds).join(", ")
              : "—"
            }
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-slate-500 uppercase tracking-wide text-xs">Start Date</p>
            <p>{project.startDate ? new Date(project.startDate).toLocaleDateString() : "—"}</p>
          </div>
          <div>
            <p className="text-slate-500 uppercase tracking-wide text-xs">End Date</p>
            <p>{project.endDate ? new Date(project.endDate).toLocaleDateString() : "—"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-slate-500 uppercase tracking-wide text-xs">Created</p>
            <p>{project.createdAt ? new Date(project.createdAt).toLocaleString() : "—"}</p>
          </div>
          <div>
            <p className="text-slate-500 uppercase tracking-wide text-xs">Updated</p>
            <p>{project.updatedAt ? new Date(project.updatedAt).toLocaleString() : "—"}</p>
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <button 
            className="flex-1 border border-slate-300 rounded-md py-2" 
            onClick={() => project && onEdit(project)}
          >
            Edit
          </button>
          <button 
            className="flex-1 bg-red-600 text-white rounded-md py-2" 
            onClick={() => project && onDelete(project)}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewProjectModal;