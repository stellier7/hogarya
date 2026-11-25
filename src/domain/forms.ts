export type FormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Record<string, string>;
};

export const idleFormState: FormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

export function errorState(message: string, fieldErrors: Record<string, string> = {}): FormState {
  return { status: "error", message, fieldErrors };
}

export function successState(message: string): FormState {
  return { status: "success", message, fieldErrors: {} };
}
