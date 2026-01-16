import type { ProjectStatusState } from "../types/state-types/ProjectStatusState";
import type { DateAction } from "../types/reducer-action-types/DateAction";
import { initialState } from "../types/state-types/ProjectStatusState";

export function StatusReducer(state: ProjectStatusState, action: DateAction) {

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