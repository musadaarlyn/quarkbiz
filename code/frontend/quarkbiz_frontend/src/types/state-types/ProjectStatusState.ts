export type ProjectStatusState = {
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  startDate: string;
  endDate: string;
  error: string | null;
}

export const initialState: ProjectStatusState = {
    status: 'Planning',
    startDate: '',
    endDate: '',
    error: null
};