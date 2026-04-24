import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { FormField } from './FormField';

// ─── Unit Tests ────────────────────────────────────────────────────────────────

describe('FormField — unit tests', () => {
  it('renders a label linked to the input via htmlFor/id', () => {
    render(
      <FormField
        id="username"
        label="Username"
        type="text"
        value=""
        onChange={vi.fn()}
      />
    );
    const input = screen.getByLabelText('Username');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'username');
  });

  it('does NOT set aria-describedby when error prop is undefined', () => {
    render(
      <FormField
        id="username"
        label="Username"
        type="text"
        value=""
        onChange={vi.fn()}
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('sets aria-describedby to "${id}-error" when error prop is provided', () => {
    render(
      <FormField
        id="username"
        label="Username"
        type="text"
        value=""
        onChange={vi.fn()}
        error="Username is required"
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'username-error');
  });

  it('renders the error span with role="alert" and correct id when error is set', () => {
    render(
      <FormField
        id="username"
        label="Username"
        type="text"
        value=""
        onChange={vi.fn()}
        error="Username is required"
      />
    );
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('id', 'username-error');
    expect(alert).toHaveTextContent('Username is required');
  });

  it('does NOT render an error span when error prop is undefined', () => {
    render(
      <FormField
        id="username"
        label="Username"
        type="text"
        value=""
        onChange={vi.fn()}
      />
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('does NOT render an error span when error prop is empty string', () => {
    render(
      <FormField
        id="username"
        label="Username"
        type="text"
        value=""
        onChange={vi.fn()}
        error=""
      />
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

// ─── Property-Based Tests ──────────────────────────────────────────────────────

describe('FormField — property-based tests', () => {
  // Feature: login-ui, Property 7: aria-describedby is set on inputs with active errors
  it('Property 7: aria-describedby points to error element id for any non-empty error string', () => {
    // Use alphanumeric ids to ensure valid HTML id attributes and reliable DOM queries
    const alphanumId = fc.stringMatching(/^[a-z][a-z0-9]{0,19}$/);

    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }), // any non-empty error string
        alphanumId,                   // valid HTML id (starts with letter, alphanumeric)
        (error, id) => {
          const { unmount, getByRole } = render(
            <FormField
              id={id}
              label="Test Field"
              type="text"
              value=""
              onChange={vi.fn()}
              error={error}
            />
          );

          const input = getByRole('textbox');
          const result = input.getAttribute('aria-describedby') === `${id}-error`;

          unmount();
          return result;
        }
      ),
      { numRuns: 100 }
    );
  });
});
