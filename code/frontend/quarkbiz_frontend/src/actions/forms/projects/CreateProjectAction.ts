import { createProject } from "../../../services/projects/ProjectsService";
import type { CreateProjectActionState } from "../../../types/state-types/CreateProjectActionState";

export async function CreateProjectAction(
  prevState: CreateProjectActionState,
  formData: FormData
): Promise<CreateProjectActionState> {

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const projName = formData.get("projName")?.toString().trim() ?? "";
  const projDescription = formData.get("projDescription")?.toString().trim() ?? "";
  const status = formData.get("status")?.toString().trim() ?? "On Hold";
  const startDate = formData.get("startDate")?.toString() ?? "";
  const endDate = formData.get("endDate")?.toString() ?? "";

  const techStackIds = formData
    .getAll("techStackIds")
    .map(id => Number(id))
    .filter(id => !Number.isNaN(id));

  const fieldErrors: CreateProjectActionState["fieldErrors"] = {};

  // ---- validations (mirrors Quarkus) ----
  if (projName.length < 2 || projName.length > 255) {
    fieldErrors.projName = "Project name must be 2–255 characters";
  }

  if (projDescription.length > 2000) {
    fieldErrors.projDescription = "Description must not exceed 2000 characters";
  }

  if (techStackIds.length === 0) {
    fieldErrors.techStackIds = "Select at least one tech stack";
  }

  if (!status) {
    fieldErrors.status = "Status is required";
  }

  if (!startDate) {
    fieldErrors.startDate = "Start date is required";
  }

  if (!endDate) {
    fieldErrors.endDate = "End date is required";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  await createProject({
    projName,
    projDescription: projDescription || undefined,
    techStackIds,
    status,
    startDate,
    endDate,
  });

  return { success: true };
}
