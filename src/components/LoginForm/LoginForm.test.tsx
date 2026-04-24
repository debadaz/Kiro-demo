import { describe, it, expect, vi } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import { LoginForm } from './LoginForm';

const noop = () => {};

// ─── Unit Tests ────────────────────────────────────────────────────────────────

describe('LoginForm — render', () => {
  it('renders username input, password input, and Login button on mount', () => {
    render(<LoginForm onLoginSuccess={noop} />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });
});

describe('LoginForm — submit behaviour', () => {
  it('shows both error messages when submitted with empty fields', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLoginSuccess={noop} />);

    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('calls onLoginSuccess when fields are valid', async () => {
    const user = userEvent.setup();
    const onLoginSuccess = vi.fn();
    render(<LoginForm onLoginSuccess={onLoginSuccess} />);

    await user.type(screen.getByLabelText('Username'), 'alice');
    await user.type(screen.getByLabelText('Password'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(onLoginSuccess).toHaveBeenCalledOnce();
  });
});

describe('LoginForm — error clearing on edit', () => {
  it('clears username error when username is edited after failed submit, password error remains', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLoginSuccess={noop} />);

    await user.click(screen.getByRole('button', { name: 'Login' }));
    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Username'), 'a');

    expect(screen.queryByText('Username is required')).not.toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('clears password error when password is edited after failed submit, username error remains', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLoginSuccess={noop} />);

    await user.click(screen.getByRole('button', { name: 'Login' }));
    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Password'), 'x');

    expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
    expect(screen.getByText('Username is required')).toBeInTheDocument();
  });
});

describe('LoginForm — accessibility', () => {
  it('Login button has type="submit"', () => {
    render(<LoginForm onLoginSuccess={noop} />);
    const button = screen.getByRole('button', { name: 'Login' });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('username label is linked to username input via htmlFor/id', () => {
    render(<LoginForm onLoginSuccess={noop} />);
    const usernameInput = screen.getByLabelText('Username');
    expect(usernameInput).toHaveAttribute('id', 'username');
  });

  it('password label is linked to password input via htmlFor/id', () => {
    render(<LoginForm onLoginSuccess={noop} />);
    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('id', 'password');
  });
});

// ─── Property-Based Tests ──────────────────────────────────────────────────────

describe('LoginForm — property-based tests', () => {
  it('Property 6: editing a field with an error clears only that field\'s error', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('username' as const, 'password' as const),
        fc.string({ minLength: 1 }),
        (field, newValue) => {
          const { unmount, container } = render(<LoginForm onLoginSuccess={noop} />);
          const view = within(container);

          const form = container.querySelector('form')!;
          fireEvent.submit(form);

          const usernameErrorBefore = view.queryByText('Username is required');
          const passwordErrorBefore = view.queryByText('Password is required');
          if (!usernameErrorBefore || !passwordErrorBefore) {
            unmount();
            return false;
          }

          const input = view.getByLabelText(field === 'username' ? 'Username' : 'Password');
          fireEvent.change(input, { target: { value: newValue } });

          const editedFieldError =
            field === 'username'
              ? view.queryByText('Username is required')
              : view.queryByText('Password is required');

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
