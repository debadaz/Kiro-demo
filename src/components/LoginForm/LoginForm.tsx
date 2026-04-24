import { useState } from 'react';
import type { FieldErrors } from '../../types/login';
import { validate } from '../../utils/validation';
import { FormField } from './FormField';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

interface LoginFormState {
  username: string;
  password: string;
  errors: FieldErrors;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [state, setState] = useState<LoginFormState>({
    username: '',
    password: '',
    errors: {},
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
      onLoginSuccess();
    } else {
      setState((prev) => ({ ...prev, errors: result.errors }));
    }
  }

  return (
    <div className={styles.container}>
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
