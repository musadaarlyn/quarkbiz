import { useEffect, useState } from "react";
import { fetchTechStacks } from "../../services/TechStackService";
import { createProject } from "../../services/ProjectsService";

type Tech = {
  id: number;
  tsName: string;
};

function CreateProject() {
  const [projName, setProjName] = useState("");
  const [projDescription, setDescription] = useState("");
  const [techStackIds, setTechStacks] = useState<number[]>([]);
  const [status, setStatus] = useState<'Planning' | 'In Progress' | 'Completed' | 'On Hold'>('Planning');
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [techs, getTechStacks] = useState<Tech[]>([]);

  const loadStacks = async () => {
    const stacksData = await fetchTechStacks();
    getTechStacks(stacksData);
  };

  useEffect(() => {
    loadStacks();
  }, []);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    if(startDate > endDate) {
      alert("Start date must be before end date");
      return;
    }

    try {
      await createProject({
        projName,
        projDescription,
        techStackIds,
        status,
        startDate,
        endDate
      });

      alert("Project Added");
      resetForm();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setProjName("");
    setDescription("");
    setTechStacks([]);
    setStatus("Planning");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="p-4 font-sans">
      <h2 className="text-2xl font-bold mb-6">Create Project</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Name */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Name</label>
          <input
            type="text"
            value={projName}
            onChange={(e) => setProjName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Description</label>
          <textarea
            value={projDescription}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Tech Stack */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Tech Stack</label>
          <select
            multiple
            required
            value={techStackIds.map(String)}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions).map(option => Number(option.value));
              setTechStacks(values);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {techs.map(tech => (
              <option key={tech.id} value={tech.id}>{tech.tsName}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'Planning' | 'In Progress' | 'Completed' | 'On Hold')}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value='Planning'>Planning</option>
            <option value='In Progress'>In Progress</option>
            <option value='Completed'>Completed</option>
            <option value='On Hold'>On Hold</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 mt-8">
          <button
            type="submit"
            className="bg-[#414547] text-white px-6 py-2 rounded-md font-medium shadow hover:bg-gray-800 transition-colors w-1/2 mx-auto block"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProject;
