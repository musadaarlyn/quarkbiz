export type CreateProjectActionState = {
  success: boolean;
  fieldErrors?: {
    projName?: string;
    projDescription?: string;
    techStackIds?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  };
};