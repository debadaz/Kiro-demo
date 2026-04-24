import { useState } from 'react';
import type { FieldErrors } from '../../types/login';
import { validate } from '../../utils/validation';
import { FormField } from './FormField';
import { SuccessMessage } from './SuccessMessage';
import styles from './LoginForm.module.css';

interface LoginFormState {
  username: string;
  password: string;
  errors: FieldErrors;
  submitted: boolean;
}

export function LoginForm() {
  const [state, setState] = useState<LoginFormState>({
    username: '',
    password: '',
    errors: {},
    submitted: false,
  });

  function handleChange(field: 'username' | 'password', value: string) {
    setState((prev) => ({
      ...prev,
      [field]: value,
      errors: {
        ...prev.errors,
        [field]: undefined,
      },
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = validate(state.username, state.password);
    if (result.valid) {
      setState((prev) => ({ ...prev, submitted: true, errors: {} }));
    } else {
      setState((prev) => ({ ...prev, errors: result.errors }));
    }
  }

  return (
    <div className={styles.container}>
      {state.submitted && <SuccessMessage message="Login successful!" />}
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <FormField
          id="username"
          label="Username"
          type="text"
          value={state.username}
          onChange={(value) => handleChange('username', value)}
          error={state.errors.username}
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          value={state.password}
          onChange={(value) => handleChange('password', value)}
          error={state.errors.password}
        />
        <button type="submit" className={styles.submitButton}>
          Login
        </button>
      </form>
    </div>
  );
}
