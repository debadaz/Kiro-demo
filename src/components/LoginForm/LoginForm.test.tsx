import { describe, it, expect } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import { LoginForm } from './LoginForm';

// ─── Unit Tests ────────────────────────────────────────────────────────────────

describe('LoginForm — render', () => {
  // 8.2 Render test: username input, password input, and Login button all present on mount
  it('renders username input, password input, and Login button on mount', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });
});

describe('LoginForm — submit behaviour', () => {
  // 8.3 Submit with both fields empty: both error messages appear simultaneously
  it('shows both error messages when submitted with empty fields', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  // 8.4 Submit with valid fields: "Login successful!" message appears and form remains visible
  it('shows "Login successful!" and keeps the form visible when fields are valid', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText('Username'), 'alice');
    await user.type(screen.getByLabelText('Password'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(screen.getByText('Login successful!')).toBeInTheDocument();
    // Form remains visible
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });
});

describe('LoginForm — error clearing on edit', () => {
  // 8.5 Submit with invalid fields, then edit username: username error clears, password error unchanged
  it('clears username error when username is edited after failed submit, password error remains', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    // Submit with empty fields to trigger both errors
    await user.click(screen.getByRole('button', { name: 'Login' }));
    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();

    // Edit the username field
    await user.type(screen.getByLabelText('Username'), 'a');

    // Username error should be gone, password error should remain
    expect(screen.queryByText('Username is required')).not.toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  // 8.6 Submit with invalid fields, then edit password: password error clears, username error unchanged
  it('clears password error when password is edited after failed submit, username error remains', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    // Submit with empty fields to trigger both errors
    await user.click(screen.getByRole('button', { name: 'Login' }));
    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();

    // Edit the password field
    await user.type(screen.getByLabelText('Password'), 'x');

    // Password error should be gone, username error should remain
    expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
    expect(screen.getByText('Username is required')).toBeInTheDocument();
  });
});

describe('LoginForm — accessibility', () => {
  // 8.8 Accessibility: Login button has type="submit"; labels linked via htmlFor/id
  it('Login button has type="submit"', () => {
    render(<LoginForm />);
    const button = screen.getByRole('button', { name: 'Login' });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('username label is linked to username input via htmlFor/id', () => {
    render(<LoginForm />);
    // getByLabelText works only when htmlFor matches the input id
    const usernameInput = screen.getByLabelText('Username');
    expect(usernameInput).toHaveAttribute('id', 'username');
  });

  it('password label is linked to password input via htmlFor/id', () => {
    render(<LoginForm />);
    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('id', 'password');
  });
});

// ─── Property-Based Tests ──────────────────────────────────────────────────────

describe('LoginForm — property-based tests', () => {
  // Feature: login-ui, Property 6: Editing a field with an error clears only that field's error
  it('Property 6: editing a field with an error clears only that field\'s error', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('username' as const, 'password' as const),
        fc.string({ minLength: 1 }),
        (field, newValue) => {
          const { unmount, container } = render(<LoginForm />);
          const view = within(container);

          // Submit with empty fields to trigger both errors (using fireEvent for speed)
          const form = container.querySelector('form')!;
          fireEvent.submit(form);

          // Both errors should be present
          const usernameErrorBefore = view.queryByText('Username is required');
          const passwordErrorBefore = view.queryByText('Password is required');
          if (!usernameErrorBefore || !passwordErrorBefore) {
            unmount();
            return false;
          }

          // Fire a change event on the chosen field
          const input = view.getByLabelText(field === 'username' ? 'Username' : 'Password');
          fireEvent.change(input, { target: { value: newValue } });

          // The edited field's error should be cleared
          const editedFieldError =
            field === 'username'
              ? view.queryByText('Username is required')
              : view.queryByText('Password is required');

          // The other field's error should remain
          const otherFieldError =
            field === 'username'
              ? view.queryByText('Password is required')
              : view.queryByText('Username is required');

          const editedCleared = editedFieldError === null;
          const otherUnchanged = otherFieldError !== null;

          unmount();
          return editedCleared && otherUnchanged;
        }
      ),
      { numRuns: 100 }
    );
  });
});
