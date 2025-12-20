import { useEffect, useState } from "react";
import Modal from "../../../ui/Modal";
import { fetchTechStacks } from "../../../../services/TechStackService";

type TechStack = {
  id: number;
  tsName: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    name: string, 
    description?: string, 
    techStackIds?: number[], 
    status?: 'Planning' | 'In Progress' | 'Completed' | 'On Hold',
    startDate?: string,
    endDate?: string
  ) => void;
  stackRefreshKey: number;
}

const AddProjectModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, stackRefreshKey }) => {

    const [errors, setErrors] = useState<{
        name?: string;
        techStacks?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
    }>({});

    const [stacks, setTechStacks] = useState<TechStack[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedStacks, setSelectedStacks] = useState<number[]>([]);
    const [status, setStatus] = useState<'Planning' | 'In Progress' | 'Completed' | 'On Hold'>('Planning');
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        if (isOpen) setErrors({});
        const load = async () => {
        try {
            setLoading(true);
            setTechStacks(await fetchTechStacks());
            setError(null);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
        };
        load();
    }, [isOpen, stackRefreshKey]);

    const toggleStack = (id: number) => {
        setSelectedStacks((prev) =>
            prev.includes(id) ? prev.filter((stackId) => stackId !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        const newErrors: typeof errors = {};

        if (!name.trim()) {
            newErrors.name = "Project name is required";
        }

        if (selectedStacks.length === 0) {
            newErrors.techStacks = "Choose at least one tech stack";
        }

        if (!status) {
            newErrors.status = "Select a status";
        }

        if (!startDate) {
            newErrors.startDate = "Start date is required";
        }
 
        if (!endDate) {
            newErrors.endDate = "End date is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit(name, description, selectedStacks, status, startDate, endDate);

        setName("");
        setDescription("");
        setSelectedStacks([]);
        setStatus("Planning");
        setStartDate("");
        setEndDate("");
        setErrors({});
        onClose();
    };

    // Return ----------------------------------------------------------
    return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Project">
      <div className="space-y-4">

        <input
            type="text"
            placeholder="Project Name"
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

        <div className="relative">
            <button
                type="button"
                onClick={() => setDropdownOpen(prev => !prev)}
                className={`w-full px-3 py-2 rounded-md border flex justify-between items-center ${
                errors.techStacks ? "border-red-500" : "border-slate-300"
                }`}
            >
                {selectedStacks.length === 0
                ? "Select tech stacks"
                : `${selectedStacks.length} selected`}
                <span className="text-xs text-slate-500">▼</span>
            </button>

            {isLoading && (
                <p className="text-sm text-slate-500 mt-1">Loading tech stacks…</p>
            )}

            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}

            {isDropdownOpen && !isLoading && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                {stacks.map(stack => (
                    <label
                    key={stack.id}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100"
                    >
                    <input
                        type="checkbox"
                        checked={selectedStacks.includes(stack.id)}
                        onChange={() => {
                        toggleStack(stack.id);
                        if (errors.techStacks) {
                            setErrors(prev => ({ ...prev, techStacks: undefined }));
                        }
                        }}
                    />
                    {stack.tsName}
                    </label>
                ))}
                </div>
            )}

            {errors.techStacks && (
                <p className="text-sm text-red-500 mt-1">{errors.techStacks}</p>
            )}
        </div>


        <select
            value={status}
            onChange={(e) => {
                setStatus(e.target.value as typeof status);
                if (errors.status) {
                setErrors(prev => ({ ...prev, status: undefined }));
                }
            }}
            className={`w-full px-3 py-2 rounded-md border ${
                errors.status ? "border-red-500" : "border-slate-300"
            }`}
            >
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
        </select>

        {errors.status && (
        <p className="text-sm text-red-500 mt-1">{errors.status}</p>
        )}


        <div className="grid grid-cols-2 gap-4">
        <div>
            <p className="text-xs uppercase text-slate-500 mb-1">Start date</p>
            <input
                type="date"
                value={startDate}
                onChange={(e) => {
                    setStartDate(e.target.value);
                    if (errors.startDate) {
                    setErrors(prev => ({ ...prev, startDate: undefined }));
                    }
                }}
                className={`w-full px-3 py-2 rounded-md border ${
                    errors.startDate ? "border-red-500" : "border-slate-300"
                }`}
            />

            {errors.startDate && (
            <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>
            )}

        </div>
        <div>
            <p className="text-xs uppercase text-slate-500 mb-1">End date</p>
            <input
                type="date"
                value={endDate}
                onChange={(e) => {
                    setEndDate(e.target.value);
                    if (errors.endDate) {
                    setErrors(prev => ({ ...prev, endDate: undefined }));
                    }
                }}
                className={`w-full px-3 py-2 rounded-md border ${
                    errors.endDate ? "border-red-500" : "border-slate-300"
                }`}
            />

            {errors.endDate && (
            <p className="text-sm text-red-500 mt-1">{errors.endDate}</p>
            )}

        </div>
        </div>

        <button
          disabled={isLoading}
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Add Project
        </button>
      </div>
    </Modal>
  );

};

export default AddProjectModal;
