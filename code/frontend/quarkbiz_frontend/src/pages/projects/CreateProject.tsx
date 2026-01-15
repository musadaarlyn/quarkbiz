import { useEffect, useState, useReducer, useRef } from "react";
import { fetchTechStacks } from "../../services/projects/TechStackService";
import { createProject } from "../../services/projects/ProjectsService";
import "../../styles/projects/CreateProject.css";

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
  type: 'changeStart';
  payLoad: string;
}

interface ChangeEndAction {
  type: 'changeEnd';
  payLoad: string;
}

interface ResetAction {
  type: 'reset';
}

type DateAction  = ChangeStartAction | ChangeEndAction | ResetAction;


const initialState: ProjectStatusState = {
    status: 'Planning',
    startDate: '',
    endDate: '',
    error: null
  };

function statusReducer(state: ProjectStatusState, action: DateAction) {

  const {type: actionType} = action;

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
        newStatus = start <= now ? 'In Progress' : 'Planning';
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
  const [techs, getTechStacks] = useState<Tech[]>([]);

  // reducers
  const [projectStatus, dispatchStatus] = useReducer(statusReducer, initialState);

  // refs
  const errorRef = useRef<HTMLDivElement | null>(null);
  const projNameRef = useRef<HTMLInputElement>(null);
  const projDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const techStackIdsRef = useRef<HTMLSelectElement>(null);

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

    const projName = projNameRef.current?.value.trim() ?? "Unnamed Project";
    const projDescription = projDescriptionRef.current?.value.trim();

    const techStackIds = Array.from(
      techStackIdsRef.current?.selectedOptions ?? []
    ).map(option => Number(option.value));


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
    // reset text inputs
    if (projNameRef.current) {
      projNameRef.current.value = "";
    }

    if (projDescriptionRef.current) {
      projDescriptionRef.current.value = "";
    }

    // reset multi-select
    if (techStackIdsRef.current) {
      Array.from(techStackIdsRef.current.options).forEach(
        option => (option.selected = false)
      );
    }
    
    // reset project status reducer
    dispatchStatus({ type: 'reset' });

    // hide error if visible
    if (errorRef.current) {
      errorRef.current.style.display = "none";
    }
  };

  // RETURN --------------------------------------------
  return (
    <div className="create-project-page">
      <h2 className="create-project-title">Create Project</h2>

      {projectStatus.error && (
        <div ref={errorRef} className="create-project-error">
          <span>{projectStatus.error}</span>
          <button
            type="button"
            onClick={() => {
              if (errorRef.current) errorRef.current.style.display = "none";
            }}
            className="create-project-error-button"
          >
            X
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="create-project-form">
        {/* Name */}
        <div className="create-project-field">
          <label className="create-project-label">Name</label>
          <input
            type="text"
            ref={projNameRef}
            required
            className="create-project-input"
          />
        </div>

        {/* Description */}
        <div className="create-project-field">
          <label className="create-project-label">Description</label>
          <textarea
            ref={projDescriptionRef}
            className="create-project-textarea"
          />
        </div>

        {/* Tech Stack */}
        <div className="create-project-field">
          <label className="create-project-label">Tech Stack</label>
          <select
            multiple
            required
            ref={techStackIdsRef}
            className="create-project-select"
          >
            {techs.map((tech) => (
              <option key={tech.id} value={tech.id}>
                {tech.tsName}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="create-project-field">
          <label className="create-project-label">Status</label>
          <input type="text" value={projectStatus.status} readOnly className="create-project-input" />
        </div>

        {/* Start Date */}
        <div className="create-project-field">
          <label className="create-project-label">Start Date</label>
          <input
            type="date"
            value={projectStatus.startDate}
            onChange={(e) =>
              dispatchStatus({ type: "changeStart", payLoad: e.target.value })
            }
            required
            className="create-project-input"
          />
        </div>

        {/* End Date */}
        <div className="create-project-field">
          <label className="create-project-label">End Date</label>
          <input
            type="date"
            value={projectStatus.endDate}
            onChange={(e) =>
              dispatchStatus({ type: "changeEnd", payLoad: e.target.value })
            }
            required
            className="create-project-input"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 mt-8">
          <button type="submit" className="create-project-submit">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProject;
