import type { ValidationResult } from '../types/login';

export function validate(username: string, password: string): ValidationResult {
  const errors: ValidationResult['errors'] = {};

  // Username checks — empty takes priority over length
  if (username.length === 0) {
    errors.username = 'Username is required';
  } else if (username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }

  // Password checks — empty takes priority over length
  if (password.length === 0) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
