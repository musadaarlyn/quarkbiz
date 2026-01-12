import { useEffect, useState, useReducer, useRef } from "react";
import { fetchTechStacks } from "../../services/projects/TechStackService";
import { createProject } from "../../services/projects/ProjectsService";

type Tech = {
  id: number;
  tsName: string;
};

// useReducer for status - dates consistency -------------- <1>

interface ProjectStatusState {
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  startDate: string;
  endDate: string;
  error: string | null;
}

interface ChangeStartAction {
  action: 'changeStart';
  payLoad: string;
}

interface ChangeEndAction {
  action: 'changeEnd';
  payLoad: string;
}

interface ResetAction {
  action: 'reset';
}

type DateAction  = ChangeStartAction | ChangeEndAction | ResetAction;


const initialState: ProjectStatusState = {
    status: 'Planning',
    startDate: '',
    endDate: '',
    error: null
  };

function statusReducer(state: ProjectStatusState, action: DateAction) {

  const {action: actionType} = action;

  // date objects for validation
  const now = new Date();
  const start = new Date(state.startDate);
  const end = new Date(state.endDate);

  switch(actionType) {

    case 'changeStart': {

      const actionDate = new Date(action.payLoad);
      const hasError = end && (actionDate > end);

      const newStatus: ProjectStatusState['status'] = actionDate <= now ? 'In Progress' : 'Planning';
        return {
          ...state,
          startDate: hasError? state.startDate : action.payLoad,
          status: hasError? state.status : newStatus,
          error: hasError ? "Start date must be before end date." : null
        }
    }

    case 'changeEnd': {

      const actionDate = new Date(action.payLoad);
      const hasError = start && (actionDate < start);

      let newStatus: ProjectStatusState['status'] = actionDate <= now ? 'Completed' : 'In Progress';

      if(newStatus==='In Progress') {
        newStatus = actionDate < now ? 'Planning': 'In Progress';
      }

      return {
          ...state,
          endDate: hasError? state.endDate : action.payLoad,
          status: hasError? state.status : newStatus,
          error: hasError ? "Start date must be before end date." : null
        }
    }

    case 'reset':
      return initialState;

    default: {
      return {
        ...state,
        error: "Failed to change date."
      };
    }

  }

}

// -------------------------------------------------------- </1>

function CreateProject() {

  // states
  const [projName, setProjName] = useState("");
  const [projDescription, setDescription] = useState("");
  const [techStackIds, setTechStacks] = useState<number[]>([]);
  const [techs, getTechStacks] = useState<Tech[]>([]);

  // reducers
  const [projectStatus, dispatchStatus] = useReducer(statusReducer, initialState);

  // refs
  const errorRef = useRef<HTMLDivElement | null>(null);

  const loadStacks = async () => {
    const stacksData = await fetchTechStacks();
    getTechStacks(stacksData);
  };

  useEffect(() => {
    loadStacks();
  }, []);

  // if the project status reducer sets a new error, show error message again
  useEffect(() => {
    if (projectStatus.error && errorRef.current) {
      errorRef.current.style.display = "flex"; // show again
    }
  }, [projectStatus.error]);

  // HANDLE FORM SUBMIT AND RESET FORM ----------------------
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createProject({
        projName,
        projDescription,
        techStackIds,
        status: projectStatus.status,
        startDate: projectStatus.startDate,
        endDate: projectStatus.endDate
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
    dispatchStatus({ action: 'reset' });
  };

  // RETURN --------------------------------------------
  return (
    <div className="p-4 font-sans">
      <h2 className="text-2xl font-bold mb-6">Create Project</h2>

       {/* Show error if exists */}
      {projectStatus.error && (
        <div ref={errorRef} className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          <span>{projectStatus.error}</span>
          <button
            type="button"
            onClick={() => {
              if (errorRef.current) {
                errorRef.current.style.display = "none";
              }
            }}
            className="ml-auto font-bold hover:text-red-900"
          >X</button>
        </div>
      )}

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
          <input type="text" value={projectStatus.status} readOnly/>
        </div>

        {/* Start Date */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={projectStatus.startDate}
            onChange={(e) => dispatchStatus({ action: 'changeStart', payLoad: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">End Date</label>
          <input
            type="date"
            value={projectStatus.endDate}
            onChange={(e) => dispatchStatus({ action: 'changeEnd', payLoad: e.target.value })}
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
