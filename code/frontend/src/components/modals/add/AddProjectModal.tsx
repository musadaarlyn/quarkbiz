import { useEffect, useState } from "react";
import Modal from "../../ui/Modal";
import { fetchTechStacks } from "../../../services/TechStackService";


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
}

const AddProjectModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {

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
    }, []);

    const toggleStack = (id: number) => {
        setSelectedStacks((prev) =>
            prev.includes(id) ? prev.filter((stackId) => stackId !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        if (!name.trim()) return alert('Project name is required');
        if (selectedStacks.length === 0) return alert('Choose at least one tech stack');
        if (!status) return alert('Select a status');
        if (!startDate) return alert('Start date is required');
        if (!endDate) return alert('End date is required');

        onSubmit(name, description, selectedStacks, status, startDate, endDate);

        setName("");
        setDescription("");
        setSelectedStacks([]);
        setStatus('Planning');
        setStartDate("");
        setEndDate("");
        onClose();
    };
    
    // Return ----------------------------------------------------------
    return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Project">
      <div className="space-y-4">

        <input
            type="text"
            placeholder="Project Name"
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

        <div className="relative">
            <button
                type="button"
                className="w-full border rounded-md px-3 py-2 flex justify-between items-center"
                onClick={() => setDropdownOpen((prev) => !prev)}
            >
                {selectedStacks.length === 0 ? 'Select tech stacks' : `${selectedStacks.length} selected`}
                <span className="text-xs text-slate-500">▼</span>
            </button>

            {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                {stacks.map((stack) => (
                    <label key={stack.id} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100">
                    <input
                        type="checkbox"
                        className="accent-blue-600"
                        checked={selectedStacks.includes(stack.id)}
                        onChange={() => toggleStack(stack.id)}
                    />
                    {stack.tsName}
                    </label>
                ))}
                </div>
            )}
        </div>

        <select
            className="w-full border rounded-md px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
        >
        <option value="Planning">Planning</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="On Hold">On Hold</option>
        </select>

        <div className="grid grid-cols-2 gap-4">
        <div>
            <p className="text-xs uppercase text-slate-500 mb-1">Start date</p>
            <input
                type="date"
                className="w-full border rounded-md px-3 py-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
        </div>
        <div>
            <p className="text-xs uppercase text-slate-500 mb-1">End date</p>
            <input
                type="date"
                className="w-full border rounded-md px-3 py-2"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />
        </div>
        </div>

        <button
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
