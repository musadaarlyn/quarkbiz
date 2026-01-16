import { createAccount } from "../../../services/accounts/AccountService";
import type { RegisterAccountActionState } from "../../../types/state-types/RegisterAccountActionState";

export async function RegisterAccountAction(
  prevState: RegisterAccountActionState,
  formData: FormData
): Promise<RegisterAccountActionState> {

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const username = formData.get("username")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString().trim() ?? "";
  const confirmPassword = formData.get("confirm-password")?.toString().trim() ?? "";
  const displayName = formData.get("display-name")?.toString() ?? "";

  const fieldErrors: RegisterAccountActionState["fieldErrors"] = {};

  // ---- validations (mirrors Quarkus) ----
  if (username.length < 6 || username.length > 60) {
    fieldErrors.username = "Username must be 6-60 characters";
  }

  if (password.length < 6 || password.length > 60) {
    fieldErrors.password = "Password must be 6–60 characters";
  }

  if (password !== confirmPassword) {
    fieldErrors.password = "Passwords do not match";
    fieldErrors.confirmPassword = "Passwords do not match";
  }

  if (displayName.length < 2 || displayName.length > 60) {
    fieldErrors.displayName = "Display name must be 2–60 characters";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  await createAccount({
    username,
    password,
    displayName
  });

  return { success: true };
}
