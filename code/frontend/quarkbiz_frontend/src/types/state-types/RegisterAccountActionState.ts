export type RegisterAccountActionState = {
  success: boolean;
  fieldErrors?: {
    username?: string;
    password?: string;
    confirmPassword?: string;
    displayName?: string;
  };
};