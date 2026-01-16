import { useEffect, useState, useReducer, useRef, useActionState } from "react";
import { fetchTechStacks } from "../../../services/projects/TechStackService";
import { CreateProjectAction } from "../../../actions/forms/projects/CreateProjectAction";
import "../../../styles/projects/CreateProject.css"
import type { CreateProjectActionState } from "../../../types/state-types/CreateProjectActionState";
import type { Tech } from "../../../types/entity-types/Tech";
import { initialState } from "../../../types/state-types/ProjectStatusState";
import { StatusReducer } from "../../../reducer-functions/StatusReducer";

// ---------------------------- ACTION STATE --------------

const initialActionState: CreateProjectActionState = {
  success: false,
};
// -------------------------------------------------------- 

function CreateProject() {

  // states
  const [techs, getTechStacks] = useState<Tech[]>([]);

  // reducers
  const [projectStatus, dispatchStatus] = useReducer(StatusReducer, initialState);

  // action states
  const [state, formAction, isPending] = useActionState(
    CreateProjectAction,
    initialActionState
  );

  // refs
  const formRef = useRef<HTMLFormElement>(null);

  // load tech stacks
  const loadStacks = async () => {
    const stacksData = await fetchTechStacks();
    getTechStacks(stacksData);
  };

  useEffect(() => {
    loadStacks();
  }, []);

  // Reset form after successful submit
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      dispatchStatus({ type: "reset" });
      alert("Project Added");
    }
  }, [state.success]);

  // RETURN --------------------------------------------
  return (
    <div className="create-project-page">
      <h2 className="create-project-title">Create Project</h2>

      <form ref={formRef} action={formAction} className="create-project-form">
        {/* Name */}
        <div className="create-project-field">
          <label className="create-project-label">Name</label>
          <input
            type="text"
            name="projName"
            required
            className="create-project-input"
          />
          {state.fieldErrors?.projName && (
            <span className="form-error">{state.fieldErrors.projName}</span>
          )}
        </div>

        {/* Description */}
        <div className="create-project-field">
          <label className="create-project-label">Description</label>
          <textarea
            name="projDescription"
            className="create-project-textarea"
          />
          {state.fieldErrors?.projDescription && (
            <span className="form-error">
              {state.fieldErrors.projDescription}
            </span>
          )}
        </div>

        {/* Tech Stack */}
        <div className="create-project-field">
          <label className="create-project-label">Tech Stack</label>
          <select
            multiple
            required
            name="techStackIds"
            className="create-project-select"
          >
            {techs.map((tech) => (
              <option key={tech.id} value={tech.id}>
                {tech.tsName}
              </option>
            ))}
          </select>
          {state.fieldErrors?.techStackIds && (
            <span className="form-error">
              {state.fieldErrors.techStackIds}
            </span>
          )}
        </div>

        {/* Status */}
        <div className="create-project-field">
          <label className="create-project-label">Status</label>
          <input 
            type="text" 
            value={projectStatus.status} 
            readOnly 
            className="create-project-input" 
          />
          <input
            type="hidden"
            name="status"
            value={projectStatus.status}
          />
        </div>

        {/* Start Date */}
        <div className="create-project-field">
          <label className="create-project-label">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={projectStatus.startDate}
            onChange={(e) =>
              dispatchStatus({ type: "changeStart", payLoad: e.target.value })
            }
            required
            className="create-project-input"
          />
          {state.fieldErrors?.startDate && (
            <span className="form-error">
              {state.fieldErrors.startDate}
            </span>
          )}
        </div>

        {/* End Date */}
        <div className="create-project-field">
          <label className="create-project-label">End Date</label>
          <input
            type="date"
            name="endDate"
            value={projectStatus.endDate}
            onChange={(e) =>
              dispatchStatus({ type: "changeEnd", payLoad: e.target.value })
            }
            required
            className="create-project-input"
          />
          {state.fieldErrors?.endDate && (
            <span className="form-error">
              {state.fieldErrors.endDate}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 mt-8">
          <button type="submit" disabled={isPending} className="create-project-submit">
            {isPending ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProject;
