export interface FieldErrors {
  username?: string; // undefined = no error
  password?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: FieldErrors;
}
